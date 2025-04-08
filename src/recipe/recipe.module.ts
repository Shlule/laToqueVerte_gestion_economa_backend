import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from 'src/recipe-ingredient/recipeIngredient.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import {Stock} from 'src/stock/stock.entity'
import { RecipeIngredientModule } from 'src/recipe-ingredient/recipe-ingredient.module';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { RecipeRepository } from './recipe.repository';
import { RecipeCostService } from './recipeCostService';
import { SubRecipeModule } from 'src/sub-recipe/sub-recipe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe,RecipeIngredient,Ingredient,Stock]),RecipeIngredientModule, IngredientModule, SubRecipeModule],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeRepository, RecipeCostService, ],
  exports: [RecipeService,RecipeCostService,],
})
export class RecipeModule {}
