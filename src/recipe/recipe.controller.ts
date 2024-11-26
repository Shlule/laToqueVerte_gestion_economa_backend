import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query, UseInterceptors } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.entity'
import { CreateRecipeDto } from './recipe.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';

@Controller('recipes')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.recipeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe> {
    const recipe = await this.recipeService.findOne(id);
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist!');
    } else {
      return recipe;
    }
  }

 
  @Get('name/:recipeName')
  async getRecipeByName(@Param('recipeName') recipeName: string): Promise<Recipe[]>{
    const recipes = await this.recipeService.getRecipeByName(recipeName);
    if(!recipes){
      throw new NotFoundException('There are no recipe with this name');
    } else{
      return recipes
    }
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async create(@Body() recipe: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.create(recipe);
  }

  @Put(':id')
  async update (@Param('id') id: string, @Body() recipe: Recipe): Promise<any> {
    return this.recipeService.update(id, recipe);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const user = await this.recipeService.findOne(id);
    if (!user) {
      throw new NotFoundException('Recipe does not exist!');
    }
    return this.recipeService.delete(id);
  }
}
