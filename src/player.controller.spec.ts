import { Test, TestingModule } from "@nestjs/testing";
import { PlayersController } from "./players.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Player, PlayerSchema } from "./model/player.schema";
import { PlayersService } from "./players.service";

describe("PlayerController", () => {
  let app: TestingModule;

  // Scraping has to be started by running server running tests.
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          process.env.DATABASE_URI || "mongodb://localhost:27017",
          {
            dbName: process.env.DATABASE_NAME || "cb_test",
            auth: {
              username: process.env.DATABASE_USER || "",
              password: process.env.DATABASE_PASS || "",
            },
          }
        ),
        MongooseModule.forFeature([
          { name: Player.name, schema: PlayerSchema },
        ]),
      ],
      providers: [PlayersService],
      controllers: [PlayersController],
    }).compile();
  });

  describe("getPlayers", () => {
    it("should return list of 10 players", async () => {
      const playersController = app.get(PlayersController);
      const players = await playersController.getPlayers(
        "",
        10,
        1,
        "Player Name",
        "ASC"
      );
      expect(players).toHaveProperty("docs");
      expect(players.docs.length).toEqual(10);
    });
    it("should filter list", async () => {
      const playersController = app.get(PlayersController);
      const nameFiler = "Luca";
      const players = await playersController.getPlayers(
        nameFiler,
        10,
        1,
        "Player Name",
        "ASC"
      );
      players.docs.map((player) =>
        expect(player["Player Name"]).toMatch(new RegExp(nameFiler, "i"))
      );
    });
    it("should sort correctly by player name asc", async () => {
      const playersController = app.get(PlayersController);
      const playerSortPlayerNameASC = (
        await playersController.getPlayers("", 1, 1, "Player Name", "ASC")
      ).docs[0];
      expect(playerSortPlayerNameASC["Player Name"]).toEqual("Abdou Harroui");
    });
    it("should sort correctly by player name desc", async () => {
      const playersController = app.get(PlayersController);
      const playerSortPlayerNameDESC = (
        await playersController.getPlayers("", 1, 1, "Player Name", "DESc")
      ).docs[0];
      expect(playerSortPlayerNameDESC["Player Name"]).toEqual(
        "Łukasz Skorupski"
      );
    });
    it("should sort correctly by yearly salary asc", async () => {
      const playersController = app.get(PlayersController);
      const playerSortYearlySalaryASC = (
        await playersController.getPlayers("", 1, 1, "Yearly Salary", "ASC")
      ).docs[0];
      expect(playerSortYearlySalaryASC["Player Name"]).toEqual("Enzo Keutgen");
    });
    it("should sort correctly by yearly salary desc", async () => {
      const playersController = app.get(PlayersController);
      const playerSortYearlySalarayDESC = (
        await playersController.getPlayers("", 1, 1, "Yearly Salary", "DESC")
      ).docs[0];
      expect(playerSortYearlySalarayDESC["Player Name"]).toEqual(
        "Dušan Vlahović"
      );
    });
  });
  describe("getPlayerSalaryHistory", () => {
    it("should have salary history", async () => {
      const playersController = app.get(PlayersController);
      const players = await playersController.getPlayers(
        "",
        1,
        1,
        "Yearly Salaray",
        "DESC"
      );
      const player = players.docs[0];

      const salaryHistory = await playersController.getPlayerSalaryHistory(
        player._id
      );
      expect(salaryHistory.length).toBeGreaterThan(0);
    });
  });
});
