import { Injectable,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';

import { RecipeRepository } from './recipe.repository';
import { SubRecipe } from '../sub-recipe/sub-recipe.entity';

@Injectable()
export class RecipeCostService {
  constructor(
    //use custom repository for transactionInterceptor use
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private myRecipeRepository: RecipeRepository,
  ) {}

  

  async calculateRecipeCost(recipeId: string):Promise<number>{

    const recipe = await this.myRecipeRepository.getRecipe(recipeId)

    let recipeIngredientsCost = 0;
    let subRecipesCost = 0;
    console.log('je suis juste avant les recipeIngredient')
    console.log(recipe)
    if(recipe.recipeIngredients?.length){
      recipeIngredientsCost = recipe.recipeIngredients.reduce((sum,ingredient) =>{
        return sum + Number(ingredient.cost);
      }, 0)
    }
    
    if(recipe.subRecipe?.length){
      subRecipesCost = recipe.subRecipe.reduce((sum, subRecipe) => {
        return sum + Number(subRecipe.cost);
      }, 0)
  }

    const totalCost = recipeIngredientsCost + subRecipesCost
    recipe.cost = totalCost;
    return totalCost;
  }
  // async calculateRecipeCost(recipeId: string):Promise<number>{
  //   const recipe = await this.myRecipeRepository.getRecipe(recipeId)
  //   console.log('bonjour')
  //   console.log(recipe)
   
  //   const totalCost = recipe.recipeIngredients.reduce((sum,ingredient) =>{
  //       return sum + Number(ingredient.cost);
  //     }, 0)
    

  //   console.log(totalCost)
  //   recipe.cost = totalCost;
  //   return totalCost;
  // }
  
}