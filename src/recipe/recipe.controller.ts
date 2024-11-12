import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.entity'

@Controller('recipe')
export class RecipeController {
    constructor(private readonly recipeService: RecipeService) {}

  //get all users
  @Get()
  async findAll(): Promise<Recipe[]> {
    return this.recipeService.findAll();
  }

  //get user by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Recipe> {
    const user = await this.recipeService.findOne(id);
    if (!user) {
      throw new NotFoundException('Recipe does not exist!');
    } else {
      return user;
    }
  }

  //make request parameter here for getting user by mail to get dynamic routing and avoid conflict
  // with get by id 
  @Get()
  async findOne_by_email(@Query('email') name: string): Promise<Recipe> {
    const user = await this.recipeService.findOne_by_name(name);
    if (!user) {
      throw new NotFoundException('Recipe does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  async create(@Body() recipe: Recipe): Promise<Recipe> {
    return this.recipeService.create(recipe);
  }

  //update user
  @Put(':id')
  async update (@Param('id') id: string, @Body() recipe: Recipe): Promise<any> {
    return this.recipeService.update(id, recipe);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    //handle error if user does not exist
    const user = await this.recipeService.findOne(id);
    if (!user) {
      throw new NotFoundException('Recipe does not exist!');
    }
    return this.recipeService.delete(id);
  }
}
