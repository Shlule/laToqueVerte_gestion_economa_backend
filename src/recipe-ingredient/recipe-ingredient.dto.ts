import { IsString, IsArray, IsNotEmpty, ValidateNested, IsUUID, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToRecipeDto {
  @IsUUID()
  ingredientId: string;

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