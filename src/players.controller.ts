import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { FindResult, PlayersService } from "./players.service";
import { SalaryHistory } from "./model/player.schema";
import { ParseObjectIdPipe } from "./utils/parse-objectid.pipe";

@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(
    @Query("name", new DefaultValuePipe("")) name,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page,
    @Query("sort", new DefaultValuePipe("Player Name")) sort,
    @Query("sortType", new DefaultValuePipe("ASC")) sortType
  ): Promise<FindResult> {
    return this.playersService.getPlayers(name, page, limit, {
      [sort]: sortType === "ASC" ? 1 : -1,
    });
  }

  @Get(":id/salary-history")
  async getPlayerSalaryHistory(
    @Param("id", ParseObjectIdPipe) _id
  ): Promise<SalaryHistory[]> {
    return this.playersService.getPlayerSalaryHistory(_id);
  }
}
