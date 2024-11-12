import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { UUID } from 'crypto';
import { IngredientService } from './ingredient.service';

@Controller('Ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  //get all users
  @Get()
  async findAll(): Promise<Ingredient[]> {
    return this.ingredientService.findAll();
  }

  //get user by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Ingredient> {
    const user = await this.ingredientService.findOne(id);
    if (!user) {
      throw new NotFoundException('Ingredient does not exist!');
    } else {
      return user;
    }
  }

  //make request parameter here for getting user by mail to get dynamic routing and avoid conflict
  // with get by id 
//   @Get()
//   async findOne_by_email(@Query('name') name: string): Promise<Ingredient> {
//     const user = await this.ingredientService.findOne_by_name(name);
//     if (!user) {
//       throw new NotFoundException('Ingredient does not exist!');
//     } else {
//       return user;
//     }
//   }

  //create user
  @Post()
  async create(@Body() ingredient: Ingredient): Promise<Ingredient> {
    return this.ingredientService.create(ingredient);
  }

  //update user
  @Put(':id')
  async update (@Param('id') id: string, @Body() ingredient: Ingredient): Promise<any> {
    return this.ingredientService.update(id, ingredient);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    //handle error if user does not exist
    const user = await this.ingredientService.findOne(id);
    if (!user) {
      throw new NotFoundException('Ingredient does not exist!');
    }
    return this.ingredientService.delete(id);
  }
}
