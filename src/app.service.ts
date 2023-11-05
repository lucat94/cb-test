import { Injectable, OnModuleInit } from "@nestjs/common";
import * as cheerio from "cheerio";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { Player } from "./model/player.schema";
import { PlayersService } from "./players.service";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly playersService: PlayersService
  ) {}

  async onModuleInit(): Promise<void> {
    const players = await this.getLeaguesPlayers();

    await this.playersService.flushAll();
    // should implement upsert
    await this.playersService.insertMany(players);
  }

  async getLeaguesPlayers(): Promise<Player[]> {
    // Include additional leagues in the array to scrape information from other leagues
    const acceptedLeagues = [
      "Serie A",
      //  "Ligue 1"
    ];

    const players = [];

    // Get /football page
    const url = "https://salarysport.com/football";
    const result = await lastValueFrom(this.httpService.get(url));
    const $ = cheerio.load(result.data);

    // Get all H2 elements, they contain leagues info
    const h2Elements = $("h2");

    // filter leagues for acceptedLeagues array
    const leagues = h2Elements.filter((index, element) =>
      acceptedLeagues.includes($(element).text().trim())
    );

    for (const league of leagues) {
      // Get teams in league
      const teams = $(league)
        .next()
        .children()
        .toArray()
        .map((el) => `${$(el).text().trim()}`)
        // Exclude the unnecessary fields
        .filter((team) => team !== "Highest Paid Players");

      // Get /football/:league/:team information using promiseAllSettled.
      const teamsPromises = await Promise.allSettled(
        teams.map((team) =>
          lastValueFrom(
            this.httpService.get(
              `${url}/${$(league).text()}/${team}`
                .replace(/ /gi, "-")
                .toLowerCase()
            )
          )
        )
      );

      // Filter only for fulfilled api call, teams rejected api are ignored.
      for (const index in teamsPromises) {
        const teamPromise = teamsPromises[index];
        if (teamPromise.status === "fulfilled") {
          // Scarping team page.
          const $ = cheerio.load(teamPromise.value.data);

          // Get table with players
          const table = $("h3:contains('Active Squad:')").next().children();

          // Get table header
          const headerText = $(table)
            .find("table thead th")
            .toArray()
            .map((el) => $(el).text());

          // Retrieve table rows, excluding hidden rows that do not have the same number of columns as the header
          const tableRows = $(table)
            .find("table tbody tr")
            .filter(
              (index, element) => element.children.length === headerText.length
            )
            .toArray();

          // Mapping rows as JSON and pushing them in players array
          players.push(
            ...tableRows.map((row) => {
              const columns = $(row).find("td");
              const values = columns.toArray().map((el) => $(el).text());
              return values.reduce(
                (acc, element, index) => {
                  if (
                    headerText[index] === "Yearly Salary" ||
                    headerText[index] === "Weekly Wage"
                  ) {
                    acc[headerText[index]] = Number(
                      element.replace(/,/g, "").substring(1)
                    );
                  } else {
                    acc[headerText[index]] = element;
                  }
                  return acc;
                },
                { Club: teams[index] }
              );
            })
          );
        }
      }
    }
    return players;
  }
}
