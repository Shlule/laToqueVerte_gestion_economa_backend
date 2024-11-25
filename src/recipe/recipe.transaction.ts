// import { Injectable } from "@nestjs/common";
// import { Recipe } from "./recipe.entity";
// import { RecipeIngredient } from "src/recipe-ingredient/recipeIngredient.entity";
// import { BaseTransaction } from "src/common/baseClass.transaction";
// import { CreateRecipeDto } from "./recipe.dto";
// import { DataSource, EntityManager } from "typeorm";

// @Injectable()
// class CreateRecipeTransaction extends BaseTransaction<CreateRecipeDto, Recipe> {
//     constructor(dataSource: DataSource){
//         super(dataSource)
//     }

//     protected async execute(data: CreateRecipeDto, manager: EntityManager): Promise<Recipe>{
//         const newRecipe = await manager.create(Recipe, data);
//     }
// }