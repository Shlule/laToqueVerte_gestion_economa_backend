import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1744642025906 implements MigrationInterface {
    name = ' $npmConfigName1744642025906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."supplier_stock_unit_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "supplier_stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(10,2) NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "unit" "public"."supplier_stock_unit_enum" NOT NULL DEFAULT 'unit', "ingredientId" uuid, CONSTRAINT "PK_0eaa918f5a522e88288691612bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."ingredient_unittype_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "pricePerUnit" numeric(10,2) NOT NULL, "unitType" "public"."ingredient_unittype_enum" NOT NULL DEFAULT 'unit', "fournisseur" character varying NOT NULL, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recipe_ingredient_unit_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantityNeeded" numeric(10,2) NOT NULL, "cost" numeric(10,2) NOT NULL, "unit" "public"."recipe_ingredient_unit_enum" NOT NULL DEFAULT 'unit', "recipeId" uuid, "ingredientId" uuid, CONSTRAINT "PK_a13ac3f2cebdd703ac557c5377c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."crafted_stock_unit_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "crafted_stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" numeric(10,2) NOT NULL, "creationDate" TIMESTAMP NOT NULL, "unit" "public"."crafted_stock_unit_enum" NOT NULL DEFAULT 'unit', "recipeId" uuid, CONSTRAINT "PK_dc39c32e055fbbcad328efe7798" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."recipe_unittype_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "quantity" numeric(10,2) NOT NULL, "unitType" "public"."recipe_unittype_enum" NOT NULL DEFAULT 'unit', "cost" numeric(10,2), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."sub_recipe_unit_enum" AS ENUM('kg', 'g', 'unit')`);
        await queryRunner.query(`CREATE TABLE "sub_recipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantityNeeded" numeric(10,2) NOT NULL, "cost" numeric(10,2) NOT NULL, "unit" "public"."sub_recipe_unit_enum" NOT NULL DEFAULT 'unit', "parentRecipeId" uuid, "subRecipeId" uuid, CONSTRAINT "PK_6b38c282a67f2aa265069559fe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "supplier_stock" ADD CONSTRAINT "FK_a442280fd14cdb620692f88034d" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_1ad3257a7350c39854071fba211" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_2879f9317daa26218b5915147e7" FOREIGN KEY ("ingredientId") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crafted_stock" ADD CONSTRAINT "FK_08dbb3f399c9553ef2bb2c61da6" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_recipe" ADD CONSTRAINT "FK_c821faf5095bf864f4c48cd0a74" FOREIGN KEY ("parentRecipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_recipe" ADD CONSTRAINT "FK_8bf5c8957fb67604852cacca927" FOREIGN KEY ("subRecipeId") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_recipe" DROP CONSTRAINT "FK_8bf5c8957fb67604852cacca927"`);
        await queryRunner.query(`ALTER TABLE "sub_recipe" DROP CONSTRAINT "FK_c821faf5095bf864f4c48cd0a74"`);
        await queryRunner.query(`ALTER TABLE "crafted_stock" DROP CONSTRAINT "FK_08dbb3f399c9553ef2bb2c61da6"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_2879f9317daa26218b5915147e7"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_1ad3257a7350c39854071fba211"`);
        await queryRunner.query(`ALTER TABLE "supplier_stock" DROP CONSTRAINT "FK_a442280fd14cdb620692f88034d"`);
        await queryRunner.query(`DROP TABLE "sub_recipe"`);
        await queryRunner.query(`DROP TYPE "public"."sub_recipe_unit_enum"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TYPE "public"."recipe_unittype_enum"`);
        await queryRunner.query(`DROP TABLE "crafted_stock"`);
        await queryRunner.query(`DROP TYPE "public"."crafted_stock_unit_enum"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredient"`);
        await queryRunner.query(`DROP TYPE "public"."recipe_ingredient_unit_enum"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TYPE "public"."ingredient_unittype_enum"`);
        await queryRunner.query(`DROP TABLE "supplier_stock"`);
        await queryRunner.query(`DROP TYPE "public"."supplier_stock_unit_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
