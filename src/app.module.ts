import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HttpModule } from "@nestjs/axios";
import { MongooseModule } from "@nestjs/mongoose";
import { PlayersModule } from "./players.module";

@Module({
  imports: [
    HttpModule,
    PlayersModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
