import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum JobStatus {
      PENDING = "pending",
      PROCESSING = "processing",
      COMPLETED = "completed",
      FAILED = "failed"
}


@Entity("jobs")

export class JobEntity {

        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column()
        type: string

        @Column({type: "enum", enum: JobStatus, default: JobStatus.PENDING})
        status: JobStatus;

        @Column()
        inputPath: string;

        @Column({nullable: true})
        outputPath?: string;

        @Column({default: 0})
        progress: number;

        @Column({type: "text", nullable: true})
        errorMessage?: string;

        @CreateDateColumn()
        createdAt: Date;

}