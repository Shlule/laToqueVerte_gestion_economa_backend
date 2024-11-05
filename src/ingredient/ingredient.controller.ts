import { Controller, Get } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';

@Controller('ingredients')
export class IngredientController {
    constructor(private readonly ingredientsService: IngredientService){}

    // CRUD For Ingredient
    @Get()
    async findAll(): Promise<Ingredient[]>{
        return this.ingredientsService.findall();
    }

}
