import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';
import { IngredientDto } from './Ingredient.dto';

@Controller('Ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async findAll(): Promise<IngredientDto[]> {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IngredientDto> {
    const ingredient = await this.ingredientService.findOne(id);
    if (!ingredient) {
      throw new NotFoundException('Ingredient does not exist!');
    } 
    return ingredient;
    
  }


  @Get()
  async findOneByName(@Query('name') name: string): Promise<IngredientDto> {
    const ingredient = await this.ingredientService.findOneByName(name);
    if (!ingredient) {
      throw new NotFoundException('Ingredient does not exist!');
    } 
    return ingredient;
    
  }
  @Post()
  async create(@Body() ingredient: IngredientDto): Promise<IngredientDto> {
    return this.ingredientService.create(ingredient);
  }

  @Put(':id')
  async update (@Param('id') id: string, @Body() ingredient: IngredientDto): Promise<any> {
    return this.ingredientService.update(id, ingredient);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const user = await this.ingredientService.findOne(id);
    if (!user) {
      throw new NotFoundException('Ingredient does not exist!');
    }
    return this.ingredientService.delete(id);
  }
}
