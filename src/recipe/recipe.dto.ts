import { IsString, IsArray, IsNotEmpty, ValidateNested, IsUUID, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

class RecipeIngredientDto {
  @IsUUID()
  ingredientId: string;

  @IsDecimal()
  quantityNeeded: number;

  @IsString()
  @IsNotEmpty()
  unit: 'kg' | 'g' | 'unit';
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipeIngredients: RecipeIngredientDto[];
}

export class InsufficientIngredient{

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  ingredientId: string;

  @IsDecimal()
  missingQuantity: number;

  @IsString()
  unit: 'kg'|'g'|'unit';

}