import { Injectable,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';

import { RecipeRepository } from './recipe.repository';

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

    const totalCost = recipe.recipeIngredients.reduce((sum,ingredient) =>{
      return sum + Number(ingredient.cost);
    }, 0)

    recipe.cost = totalCost;
    return totalCost;
  }


}