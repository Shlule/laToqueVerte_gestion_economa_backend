import { forwardRef, Module } from '@nestjs/common';
import { SubRecipeController } from './sub-recipe.controller';
import { SubRecipeService } from './sub-recipe.service';
import { SubRecipeRepository } from './sub-recipe.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubRecipe } from './sub-recipe.entity';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeModule } from '../recipe/recipe.module';

@Module({
  imports:[TypeOrmModule.forFeature([SubRecipe, Recipe]), forwardRef(() => RecipeModule)],
  providers:[SubRecipeService, SubRecipeRepository],
  controllers: [SubRecipeController],
  exports: [SubRecipeService]

})
export class SubRecipeModule {}
