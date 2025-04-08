import { Expose, Type } from "class-transformer";
import { IsDecimal, IsEnum, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { RecipeDto } from "src/recipe/recipe.dto";

export class SubRecipeDto{
    @Expose()
    @IsUUID()
    id: string

    @Expose()
    @IsDecimal()
    cost: number

    @Expose()
    @IsDecimal()
    quantityNeeded: number

    @Expose()
    @IsEnum(['kg', 'g', 'unit'])
    unit: 'kg' | 'g' | 'unit'

    @Expose()
    @ValidateNested()
    @Type(()=> RecipeDto )
    parentRecipe: RecipeDto

    @Expose()
    @ValidateNested()
    @Type(() =>RecipeDto)
    subRecipe: RecipeDto

}