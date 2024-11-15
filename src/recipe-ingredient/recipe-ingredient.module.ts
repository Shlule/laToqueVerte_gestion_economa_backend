import { Module } from '@nestjs/common';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { RecipeIngredientController } from './recipe-ingredient.controller';

@Module({
  providers: [RecipeIngredientService],
  controllers: [RecipeIngredientController]
})
export class RecipeIngredientModule {}
