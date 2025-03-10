import { IsString, IsArray, IsNotEmpty, ValidateNested, IsUUID, IsDecimal,IsEnum } from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { RecipeDto } from '../recipe/recipe.dto';
import { IngredientDto } from '../ingredient/Ingredient.dto';


export class RecipeIngredientDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @ValidateNested()
  @Type(() => RecipeDto)  
  recipe: RecipeDto;

  @Expose()
  @ValidateNested()
  @Type(() => IngredientDto) 
  ingredient: IngredientDto;

  @Expose()
  @IsDecimal()
  quantityNeeded: number;

  @Expose()
  @IsDecimal()
  cost: number;

  @Expose()
  @IsEnum(['kg', 'g', 'unit'])
  unit: 'kg' | 'g' | 'unit';
}

export class AddToRecipeDto {

  @IsUUID()
  recipeId: string;

  @IsDecimal()
  cost: number;
    
  @IsDecimal()
  quantityNeeded: number;

  @IsString()
  @IsNotEmpty()
  unit: 'kg' | 'g' | 'unit';
}

