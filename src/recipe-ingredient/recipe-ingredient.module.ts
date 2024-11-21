import { Module } from '@nestjs/common';
import { RecipeIngredientController } from './recipe-ingredient.controller';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RecipeIngredient])],
  providers: [RecipeIngredientService],
  controllers: [RecipeIngredientController],
  // exports: [RecipeIngredientService]
})
export class RecipeIngredientModule {}
