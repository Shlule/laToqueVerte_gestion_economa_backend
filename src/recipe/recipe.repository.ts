import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { DataSource } from "typeorm";
import { Recipe } from "./recipe.entity";
import { CreateRecipeDto } from "./recipe.dto";

@Injectable({scope: Scope.REQUEST})
export class RecipeRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request){
        super(dataSource, req);
    }

    async getAllRecipes(){
        return await this.getRepository(Recipe).find()
    }

    async getRecipe(recipeId: string):Promise<Recipe>{
    return await this.getRepository(Recipe).findOne({where: {id: recipeId}});
    }

    async getRecipesByName(name: string): Promise<Recipe[]>{
        const recipeList = this.getRepository(Recipe)
        .createQueryBuilder('recipe')
        .where('recipe.name = :name',{name})

        return await recipeList.getMany()
    }

    async createRecipe(recipe: CreateRecipeDto): Promise<Recipe>{
        const {recipeIngredients, ...recipeData} = recipe
        const newRecipe = await this.getRepository(Recipe).create(recipeData)
        console.log(newRecipe)
        return await this.getRepository(Recipe).save(newRecipe)
    }

    // async saveRecipe(recipe: Partial<Recipe>): Promise<Recipe>{
    //     return await this.getRepository(Re)
    // }
    
    async deleteRecipe(id: string){
        return await this.getRepository(Recipe).delete(id);
    }

}