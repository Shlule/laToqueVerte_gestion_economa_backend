import { IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class IngredientQuantityDto {
  @IsString()
  ingredientId: string;

  @IsNumber()
  quantityNeeded: number;
}

export class CreateRecipeDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientQuantityDto)
  ingredients: IngredientQuantityDto[];
}