import { IsString, IsArray, IsNotEmpty, ValidateNested, IsUUID, IsDecimal, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RecipeIngredientDto } from '../recipe-ingredient/recipe-ingredient.dto';
import { SubRecipe } from '../sub-recipe/sub-recipe.entity';
import { SubRecipeDto } from '../sub-recipe/sub-recipe.dto';



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

export class InsufficientSubRecipe{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  childRecipeId: string;

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
  quantity: number

  @Expose()
  @IsEnum(['kg', 'g', 'unit'])
  unitType: 'kg' | 'g' | 'unit';

  @Expose()
  @IsOptional()
  @IsDecimal()
  cost?: number

  @Expose()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipeIngredients?: RecipeIngredientDto[];

  @Expose()
  @IsArray()
  @IsOptional()
  @ValidateNested({each: true})
  @Type(() =>SubRecipe)
  subRecipes?: SubRecipe[];
  
}

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  quantity: number;

  @Expose()
  @IsEnum(['kg', 'g', 'unit'])
  unitType: 'kg' | 'g' | 'unit';

  @IsArray()
  @IsOptional()
  @ValidateNested({each:true})
  @Type(()=> SubRecipeDto)
  subRecipes: SubRecipeDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  recipeIngredients: RecipeIngredientDto[];
}

