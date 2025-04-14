import { IsString, IsArray, IsNotEmpty, ValidateNested, IsUUID, IsDecimal, IsOptional, IsEnum } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { RecipeIngredientDto } from '../recipe-ingredient/recipe-ingredient.dto';
import { SupplierStockDto } from '../supplier-stock/supplier-stocks.dto';

export class IngredientDto{

    @Expose()
    @IsUUID()
    id: string

    @Expose()
    @IsString()
    name: string

    @Expose()
    @IsDecimal()
    pricePerUnit: number

    @Expose()
    @IsEnum(['kg', 'g', 'unit'])
    unitType: 'kg' | 'g' | 'unit';

    @Expose()
    @IsString()
    fournisseur: string

    @Expose()
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => RecipeIngredientDto)
    recipeIngredients?: RecipeIngredientDto[]

    @Expose()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => SupplierStockDto)
    stocks?: SupplierStockDto[];


}