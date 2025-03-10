import { Expose, Type } from "class-transformer";
import { IsDecimal, IsOptional, IsUUID, ValidateNested , IsDate, IsEnum} from "class-validator";
import { IngredientDto } from "src/ingredient/Ingredient.dto";


export class StockDto{

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
    unit: 'kg'| 'g'| 'unit'

}