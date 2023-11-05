import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PlayerDocument = HydratedDocument<Player>;

export interface SalaryHistory {
  Year: number;
  "Weekly Wage": number;
  "Yearly Salary": number;
  Club: string;
  Position: string;
  League: string;
  Age: number;
  "Contract Expiry": string;
}

@Schema({ collection: "players", timestamps: true })
export class Player {
  @Prop({ type: String })
  Club: string;

  @Prop({ type: String })
  "Player Name": string;

  @Prop({ type: Number })
  "Weekly Wage": number;

  @Prop({ type: Number })
  "Yearly Salary": number;

  @Prop({ type: Number })
  Age: number;

  @Prop({ type: String })
  Position: string;

  @Prop({ type: String })
  Nationality: string;

  @Prop({
    type: [
      {
        Year: { type: Number },
        "Weekly Wage": { type: Number },
        "Yearly Salary": { type: Number },
        Club: { type: String },
        Position: { type: String },
        League: { type: String },
        Age: { type: Number },
        "Contract Expiry": { type: String },
      },
    ],
    required: false,
  })
  salaryHistory?: SalaryHistory[];
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
