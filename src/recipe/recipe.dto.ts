import { IsString, IsArray, IsNotEmpty, ValidateNested, IsUUID, IsDecimal, IsOptional, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RecipeIngredientDto } from 'src/recipe-ingredient/recipe-ingredient.dto';

// class RecipeIngredient {
//   @IsUUID()
//   ingredientId: string;

//   @IsDecimal()
//   quantityNeeded: number;

//   @IsString()
//   @IsNotEmpty()
//   unit: 'kg' | 'g' | 'unit';
// }

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

export class RecipeDto{

  @Expose()
  @IsUUID()
  id: string

  @Expose()
  @IsString()
  name: string
  
  @Expose()
  @IsDecimal()
  numberOfPieces: number

  @Expose()
  @IsOptional()
  @IsDecimal()
  cost?: number

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipeIngredients?: RecipeIngredientDto[];

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsufficientIngredient) 
  insufficientIngredient?: InsufficientIngredient[];
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  numberOfPieces: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipeIngredients: RecipeIngredientDto[];
}

