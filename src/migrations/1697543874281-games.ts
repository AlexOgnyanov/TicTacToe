import { MigrationInterface, QueryRunner } from "typeorm";

export class Games1697543874281 implements MigrationInterface {
    name = 'Games1697543874281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."games_outcome_enum" AS ENUM('USER_1_WINS', 'USER_2_WINS', 'DRAW')`);
        await queryRunner.query(`CREATE TYPE "public"."games_state_enum" AS ENUM('PENDING', 'IN_PROGRESS', 'ENDED')`);
        await queryRunner.query(`CREATE TABLE "games" ("id" SERIAL NOT NULL, "linkId" character varying NOT NULL, "outcome" "public"."games_outcome_enum", "state" "public"."games_state_enum" NOT NULL, "user1Id" integer, "user2Id" integer, CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_47147fa525d8d9670ebea355f82" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "games" ADD CONSTRAINT "FK_f87ec10e7554c7fd5d3a8bf9a57" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_f87ec10e7554c7fd5d3a8bf9a57"`);
        await queryRunner.query(`ALTER TABLE "games" DROP CONSTRAINT "FK_47147fa525d8d9670ebea355f82"`);
        await queryRunner.query(`DROP TABLE "games"`);
        await queryRunner.query(`DROP TYPE "public"."games_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."games_outcome_enum"`);
    }

}
