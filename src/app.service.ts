import { Injectable, OnModuleInit } from "@nestjs/common";
import * as cheerio from "cheerio";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { Player } from "./model/player.schema";
import { PlayersService } from "./players.service";
import getTableData from "./utils/getTableData";

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly playersService: PlayersService
  ) {}

  async onModuleInit(): Promise<void> {
    console.log("Scraping starting");
    const players = await this.getLeaguesPlayers();

    await this.playersService.flushAll();
    // should implement upsert and cron
    await this.playersService.insertMany(players);
    console.log("Scraping ended");
  }

  async getLeaguesPlayers(): Promise<Player[]> {
    // Include additional leagues in the array to scrape information from other leagues
    const acceptedLeagues = [
      "Serie A",
      //  "Ligue 1"
    ];

    const players: Player[] = [];

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
          // Mapping rows as JSON and pushing them in players array
          players.push(
            ...getTableData(teamPromise.value.data, "Active Squad:", {
              Club: teams[index],
              "Player Name": "",
              "Weekly Wage": 0,
              "Yearly Salary": 0,
              Age: 0,
              Position: "",
              Nationality: "",
              salaryHistory: [],
            })
          );
        }
      }
    }
    const playersPromises = await Promise.allSettled(
      players.map((player) =>
        lastValueFrom(
          this.httpService.get(
            `${url}/player/${player["Player Name"]}`
              .replace(/ /gi, "-")
              .toLowerCase()
          )
        )
      )
    );
    for (const index in playersPromises) {
      const playerPromise = playersPromises[index];
      if (playerPromise.status === "fulfilled") {
        players[index].salaryHistory = getTableData(
          playerPromise.value.data,
          "Career Earnings:",
          {}
        );
      }
    }
    return players;
  }
}
