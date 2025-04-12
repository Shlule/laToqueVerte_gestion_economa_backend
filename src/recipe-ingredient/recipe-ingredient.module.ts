import { forwardRef, Module } from '@nestjs/common';
import { RecipeIngredientController } from './recipe-ingredient.controller';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { IngredientModule } from '../ingredient/ingredient.module';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeModule } from '../recipe/recipe.module';
import { Ingredient } from '../ingredient/ingredient.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RecipeIngredient, Recipe, Ingredient]), forwardRef(() => RecipeModule),IngredientModule],
  providers: [RecipeIngredientService,RecipeIngredientRepository],
  controllers: [RecipeIngredientController],
  exports: [RecipeIngredientService]
})
export class RecipeIngredientModule {}
