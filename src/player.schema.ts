import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ collection: "players", timestamps: true })
export class Player {
  @Prop()
  Club: string;

  @Prop()
  "Player Name": string;

  @Prop()
  "Weekly Wage": string;

  @Prop()
  "Yearly Salary": string;

  @Prop()
  Age: string;

  @Prop()
  Position: string;

  @Prop()
  Nationality: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
