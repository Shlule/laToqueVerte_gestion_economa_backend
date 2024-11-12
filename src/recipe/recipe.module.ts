import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from 'src/recipe-ingredient/recipeIngredient.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import {Stock} from 'src/stock/stock.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Recipe,RecipeIngredient,Ingredient,Stock])],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService],
})
export class RecipeModule {}
