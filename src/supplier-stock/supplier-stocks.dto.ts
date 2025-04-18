import { Expose, Type } from "class-transformer";
import { IsDecimal, IsOptional, IsUUID, ValidateNested , IsDate, IsEnum} from "class-validator";
import { IngredientDto } from "../ingredient/Ingredient.dto";


export class SupplierStockDto{

    @Expose()
    @IsUUID()
    id: string;

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => IngredientDto)
    ingredient?: IngredientDto;
    

    @Expose()
    @IsDecimal()
    quantity: number;

    @Expose()
    @IsDate()
    expirationDate: Date;

    @Expose()
    @IsEnum(['kg', 'g', 'unit'])
    unit: 'kg'| 'g'| 'unit';

}