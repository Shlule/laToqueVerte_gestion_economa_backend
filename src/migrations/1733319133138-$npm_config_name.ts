import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1733319133138 implements MigrationInterface {
    name = ' $npmConfigName1733319133138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_7d38258a75e111d1941000aaff8"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_7d38258a75e111d1941000aaff8" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_7d38258a75e111d1941000aaff8"`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_7d38258a75e111d1941000aaff8" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
