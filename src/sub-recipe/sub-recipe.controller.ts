import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { SubRecipeService } from './sub-recipe.service';
import { SubRecipeDto } from './sub-recipe.dto';
import MyNotFoundError from '../common/execption/notFound.execption';
import { BulkOperationBase } from 'typeorm';
import { SubRecipe } from './sub-recipe.entity';

@Controller('sub-recipes')
export class SubRecipeController {
    constructor(private readonly subRecipeService: SubRecipeService){}

    @Get()
    async findAll(): Promise<SubRecipeDto[]>{
        return this.subRecipeService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<SubRecipeDto>{
        const subRecipe = await this.subRecipeService.findOne(id);
        if(!subRecipe){
            throw new NotFoundException('SubRecipe does not exist!')
            
        }else{
            return subRecipe
        }
    }

    @Get('/byParentRecipe/:recipeId')
    async getAllByParentRecipe(@Param('recipeId') recipeId: string): Promise<SubRecipeDto[]>{
        console.log('bonjour')
        const subRecipes = await this.subRecipeService.getAllByParentRecipe(recipeId)
        if(!subRecipes){
            throw new MyNotFoundError('recipe',recipeId);
        }else{
            return subRecipes;
        }
    }

    @Post()
    async addSubRecipe(@Body() subRecipe: SubRecipe): Promise<SubRecipeDto>{
        return this.subRecipeService.create(subRecipe)
    }

    @Put(':id')
    async update(@Param('id') id:string, @Body() subRecipe: SubRecipeDto): Promise<any>{
        return this.subRecipeService.update(id, subRecipe)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const subRecipe = await this.subRecipeService.findOne(id);
        if(!subRecipe){
            throw new NotFoundException('subRecipe does not exist!')
        }
        return this.subRecipeService.delete(id)
    }

}
