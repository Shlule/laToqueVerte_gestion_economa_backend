import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { DataSource } from "typeorm";
import { Recipe } from "./recipe.entity";

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
        const stockList = this.getRepository(Recipe)
        .createQueryBuilder('recipe')
        .where('recipe.name = :name',{name})

        return await stockList.getMany()
    }
    
    async deleteRecipe(id: string){
        return await this.getRepository(Recipe).delete(id);
    }

}