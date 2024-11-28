import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1732707906364 implements MigrationInterface {
    name = ' $npmConfigName1732707906364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."stock_unit_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(10,2) NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "unit" "public"."stock_unit_enum" NOT NULL DEFAULT 'unit', "ingredientId" uuid, CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ingredient_unittype_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "pricePerUnit" numeric(10,2) NOT NULL, "unitType" "public"."ingredient_unittype_enum" NOT NULL DEFAULT 'unit', "fournisseur" character varying NOT NULL, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "isPossible" boolean NOT NULL DEFAULT false, "numberOfPieces" integer NOT NULL, "cost" numeric(10,2), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recipe_ingredient_unit_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantityNeeded" numeric(10,2) NOT NULL, "cost" numeric(10,2) NOT NULL, "unit" "public"."recipe_ingredient_unit_enum" NOT NULL DEFAULT 'unit', "recipeId" uuid, "ingredientId" uuid, CONSTRAINT "PK_a13ac3f2cebdd703ac557c5377c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock" ADD CONSTRAINT "FK_7d38258a75e111d1941000aaff8" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_1ad3257a7350c39854071fba211" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_2879f9317daa26218b5915147e7" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_2879f9317daa26218b5915147e7"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_1ad3257a7350c39854071fba211"`);
        await queryRunner.query(`ALTER TABLE "stock" DROP CONSTRAINT "FK_7d38258a75e111d1941000aaff8"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredient"`);
        await queryRunner.query(`DROP TYPE "public"."recipe_ingredient_unit_enum"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TYPE "public"."ingredient_unittype_enum"`);
        await queryRunner.query(`DROP TABLE "stock"`);
        await queryRunner.query(`DROP TYPE "public"."stock_unit_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
