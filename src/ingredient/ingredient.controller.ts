import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';

@Controller('Ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async findAll(): Promise<Ingredient[]> {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ingredient> {
    const user = await this.ingredientService.findOne(id);
    if (!user) {
      throw new NotFoundException('Ingredient does not exist!');
    } else {
      return user;
    }
  }


  @Get()
  async findOneByName(@Query('name') name: string): Promise<Ingredient> {
    const user = await this.ingredientService.findOneByName(name);
    if (!user) {
      throw new NotFoundException('Ingredient does not exist!');
    } else {
      return user;
    }
  }
  @Post()
  async create(@Body() ingredient: Ingredient): Promise<Ingredient> {
    return this.ingredientService.create(ingredient);
  }

  @Put(':id')
  async update (@Param('id') id: string, @Body() ingredient: Ingredient): Promise<any> {
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
