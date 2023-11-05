import { Injectable } from "@nestjs/common";
import { Player } from "./model/player.schema";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

export interface FindResult {
  docs: any[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}
@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}

  async insertMany(players: Player[]) {
    return this.playerModel.insertMany(players);
  }
  async flushAll() {
    return this.playerModel.deleteMany({});
  }

  async getPlayers(
    name = "",
    page = 1,
    limit = 10,
    sort = {}
  ): Promise<FindResult> {
    const docs = await this.playerModel.find(
      {
        "Player Name": { $regex: `${name}`, $options: "i" },
      },
      {
        salaryHistory: 0,
      },
      {
        skip: (page >= 1 ? page - 1 : 0) * limit,
        limit,
        sort,
      }
    );
    const totalDocs = await this.playerModel
      .find({
        "Player Name": { $regex: `${name}`, $options: "i" },
      })
      .count();
    return {
      docs,
      totalDocs,
      page,
      totalPages: Math.ceil(totalDocs / limit),
      limit,
    };
  }
  async getPlayerSalaryHistory(_id: mongoose.ObjectId) {
    const player = await this.playerModel.findById(_id);
    return player.salaryHistory;
  }
}
