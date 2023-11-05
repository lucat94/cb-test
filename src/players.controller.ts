import { Controller, Get, Query } from "@nestjs/common";
import { FindResult, PlayersService } from "./players.service";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(
    @Query()
    { name = "", limit = 10, page = 1, sort = "Player Name", sortType = "ASC" }
  ): Promise<FindResult> {
    return this.playersService.getPlayers(name, page, limit, {
      [sort]: sortType === "ASC" ? 1 : -1,
    });
  }
}
