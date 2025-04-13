import { Expose, Type } from "class-transformer";
import { IsDate, IsDecimal, IsEnum, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { RecipeDto } from"../recipe/recipe.dto";

export class CraftedStockDto{
    @Expose()
    @IsUUID()
    id: string;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => RecipeDto)
    recipe?:RecipeDto;

    @Expose()
    @IsDecimal()
    quantity: number;

    @Expose()
    @IsDate()
    creationDate: Date;

    @Expose()
    @IsEnum(['kg','g','unit'])
    unit: 'kg'|'g'|'unit';
}