import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1732190995371 implements MigrationInterface {
    name = ' $npmConfigName1732190995371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "cost" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe" ALTER COLUMN "cost" SET NOT NULL`);
    }

}
