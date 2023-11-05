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
  "Weekly Wage": number;

  @Prop()
  "Yearly Salary": number;

  @Prop()
  Age: number;

  @Prop()
  Position: string;

  @Prop()
  Nationality: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
