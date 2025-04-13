import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query, UseInterceptors } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.entity'
import { CreateRecipeDto, RecipeDto} from './recipe.dto';
import { TransactionInterceptor } from '../common/transaction.interceptor';
import { InsufficientIngredient } from './recipe.dto';
@Controller('recipes')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

  @Get()
  async findAll(): Promise<RecipeDto[]> {
    return this.recipeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RecipeDto> {
    const recipe = await this.recipeService.findOne(id);
    if (!recipe) {
      throw new NotFoundException('Recipe does not exist!');
    } 
    return recipe;
    
  }

 
  @Get('name/:recipeName')
  async getRecipeByName(@Param('recipeName') recipeName: string): Promise<RecipeDto[]>{
    const recipes = await this.recipeService.getRecipeByName(recipeName);
    if(!recipes){
      throw new NotFoundException('There are no recipe with this name');
    } 
    return recipes
    
  }


  @Get(':id/insufficientIngredients')
  async getInsufficientIngredients(@Param('id') recipeId:string){
    return await this.recipeService.getInsufficientIngredients(recipeId);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  async create(@Body() recipe: CreateRecipeDto): Promise<RecipeDto> {
    return this.recipeService.create(recipe);
  }

  @Put(':id')
  async update (@Param('id') id: string, @Body() recipe: RecipeDto): Promise<any> {
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
