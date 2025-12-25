import { Module } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobEntity } from "./jobs.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
              JobEntity 
        ]),
    ],
    providers: [JobsService],
    exports: [JobsService],
})


export class JobsModule {}