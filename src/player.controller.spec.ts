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
  });
  it("should have salary history", async () => {
    const playersController = app.get(PlayersController);
    const players = await playersController.getPlayers(
      "",
      10,
      1,
      "Yearly Salaray",
      "DESC"
    );
    // expect(result).toHaveProperty("docs");
    // expect(result.docs.length).toEqual(10);
    const player = players.docs[0];

    const salaryHistory = await playersController.getPlayerSalaryHistory(
      player._id
    );
    expect(salaryHistory.length).toBeGreaterThan(0);
  });
});
