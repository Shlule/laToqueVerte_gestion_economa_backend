import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import {Stock} from '../stock/stock.entity'
import { RecipeIngredientModule } from '../recipe-ingredient/recipe-ingredient.module';
import { IngredientModule } from '../ingredient/ingredient.module';
import { RecipeRepository } from './recipe.repository';
import { RecipeCostService } from './recipeCostService';
import { SubRecipeModule } from '../sub-recipe/sub-recipe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe,RecipeIngredient,Ingredient,Stock]),RecipeIngredientModule, IngredientModule, SubRecipeModule],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeRepository, RecipeCostService, ],
  exports: [RecipeService,RecipeCostService,],
})
export class RecipeModule {}
