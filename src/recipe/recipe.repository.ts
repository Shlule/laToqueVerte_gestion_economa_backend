import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { DataSource } from "typeorm";
import { Recipe } from "./recipe.entity";
import { CreateRecipeDto } from "./recipe.dto";
import { RecipeIngredient } from "src/recipe-ingredient/recipeIngredient.entity";

@Injectable({scope: Scope.REQUEST})
export class RecipeRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request){
        super(dataSource, req);
    }

    async getAllRecipes(){
        return await this.getRepository(Recipe).find()
    }

    async getRecipe(recipeId: string):Promise<Recipe>{

        const recipe = await this.getRepository(Recipe).findOne({where: {id: recipeId}, relations:['recipeIngredients','subRecipe']});
        if(!recipe){
            throw new Error(`Recipe with the ID ${recipeId} not found`);
        }
        return recipe;
    }

    async getRecipesByName(name: string): Promise<Recipe[]>{
        const recipeList = this.getRepository(Recipe)
        .createQueryBuilder('recipe')
        .where('recipe.name = :name',{name})

        return await recipeList.getMany()
    }

    async createRecipe(recipe: CreateRecipeDto): Promise<Recipe>{
        const {recipeIngredients, subRecipes, ...recipeData} = recipe
        const newRecipe = await this.getRepository(Recipe).create(recipeData)
        return await this.getRepository(Recipe).save(newRecipe)
    }

    async saveRecipe(recipe: Partial<Recipe>): Promise<Recipe>{
        return await this.getRepository(Recipe).save(recipe)
    }
    
    async deleteRecipe(id: string){
        return await this.getRepository(Recipe).delete(id);
    }

    // SECTION - not used 
    async getInsufficientIngredients(recipeId: string){
        const insuffcientIngredients = await this.getRepository(RecipeIngredient)
        .createQueryBuilder('ri')
        .leftJoinAndSelect('ri.ingredient', 'ingredient')
        .leftJoin('ingredient.stock', 'stock')
        .select([
      'ingredient.id AS id',
      'ingredient.name AS name',
      'ri.quantityNeeded - COALESCE(stock.quantity, 0) AS missingQty',
        ])
        .where('ri.recipeId = :recipeId', { recipeId })
        .andWhere('ri.quantityNeeded > COALESCE(stock.quantity, 0)')
        .getRawMany();

        return insuffcientIngredients
    }
    //!SECTION
}