import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "src/config";
import { JobEntity } from "../jobs/jobs.entity";


@Module({
     imports: [
        TypeOrmModule.forRootAsync({
              useFactory: async () => ({
                    type: 'mysql',
                    host: databaseConfig.host,
                    port: databaseConfig.port,
                    username: databaseConfig.user,
                    password: databaseConfig.password,
                    database: databaseConfig.database,
                    entities: [JobEntity],
                    synchronize: false,
              })
        })
     ],
})



export class DatabaseModule {}