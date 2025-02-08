import { forwardRef, Module } from '@nestjs/common';
import { RecipeIngredientController } from './recipe-ingredient.controller';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { IngredientModule } from 'src/ingredient/ingredient.module';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';
import { Recipe } from 'src/recipe/recipe.entity';
import { RecipeModule } from 'src/recipe/recipe.module';
import { Ingredient } from 'src/ingredient/ingredient.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RecipeIngredient, Recipe, Ingredient]), forwardRef(() => RecipeModule),IngredientModule],
  providers: [RecipeIngredientService,RecipeIngredientRepository],
  controllers: [RecipeIngredientController],
  exports: [RecipeIngredientService]
})
export class RecipeIngredientModule {}
