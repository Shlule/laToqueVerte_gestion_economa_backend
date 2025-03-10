import { Inject, Injectable, Scope } from "@nestjs/common";
import { Request } from "express";
import {REQUEST} from "@nestjs/core";
import { BaseRepository } from "src/common/base-repository";
import { DataSource } from "typeorm";
import { RecipeIngredient } from "./recipeIngredient.entity";
import { RecipeIngredientDto } from "./recipe-ingredient.dto";

// create a personnal repositoey for Transaction on decorator in the controller 

@Injectable({scope: Scope.REQUEST})
export class RecipeIngredientRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request){
        super(dataSource, req)
    }

    // create multiple items
    async createRecipeIngredient(recipeIngredient: RecipeIngredientDto){
        const newRecipeIngredient = await this.getRepository(RecipeIngredient).create(recipeIngredient);
        return await this.getRepository(RecipeIngredient).save(newRecipeIngredient);
    }

    async getAllByRecipe(recipeId: string):Promise<RecipeIngredient[]>{
        return await this.getRepository(RecipeIngredient)
        .createQueryBuilder('recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('recipeIngredient.recipeId = :recipeId', { recipeId })
        .getMany();
    }

    async getAllByIngredient(ingredientId: string):Promise<RecipeIngredient[]>{
        return await this.getRepository(RecipeIngredient)
        .createQueryBuilder('recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('recipeIngredient.ingredientId = :ingredientId',{ingredientId})
        .getMany();
    }

    async getAllByRecipeWithStock(recipeId: string):Promise<RecipeIngredient[]>{
        return await this.getRepository(RecipeIngredient)
        .createQueryBuilder('recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .leftJoinAndSelect('ingredient.stock', 'stock')
        .where('recipeIngredient.recipeId = :recipeId', { recipeId })
        .getMany();
    }
    
}