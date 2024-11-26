import { Inject, Injectable, Scope } from "@nestjs/common";
import { Request } from "express";
import {REQUEST} from "@nestjs/core";
import { BaseRepository } from "src/common/base-repository";
import { DataSource } from "typeorm";
import { RecipeIngredient } from "./recipeIngredient.entity";

@Injectable({scope: Scope.REQUEST})
export class RecipeIngredientRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request){
        super(dataSource, req)
    }

    // create multiple items
    async createRecipeIngredient(recipeIngredient: Partial<RecipeIngredient>){
        const newRecipeIngredient = await this.getRepository(RecipeIngredient).create(recipeIngredient);
        return await this.getRepository(RecipeIngredient).save(newRecipeIngredient);
    }
}