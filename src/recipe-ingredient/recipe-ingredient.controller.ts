import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put} from '@nestjs/common';
import { RecipeIngredient } from './recipeIngredient.entity';
import { RecipeIngredientService } from './recipe-ingredient.service';
import MyNotFoundError from 'src/common/execption/notFound.execption';
import { AddToRecipeDto } from './recipe-ingredient.dto';

@Controller('recipe-ingredients')
export class RecipeIngredientController {
    constructor(private readonly recipeIngredientService: RecipeIngredientService){}

    @Get()
    async findAll(): Promise<RecipeIngredient[]>{
        return this.recipeIngredientService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<RecipeIngredient>{
        const recipeIngredient = await this.recipeIngredientService.findOne(id);
        if(!recipeIngredient){
            throw new NotFoundException('RecipeIngredient does not exist!');
        } else{
            return recipeIngredient;
        }
    }

    @Get('/byRecipe/:recipeId')
    async getAllByRecipe(@Param('recipeId') recipeId:string):Promise<RecipeIngredient[]>{
        const recipeIngredients = await this.recipeIngredientService.getAllByRecipe(recipeId);
        if(!recipeIngredients){
            throw new MyNotFoundError('recipe',recipeId);
        }else{
            return recipeIngredients;
        }
    }

    @Post()
async addToRecipe(@Body() recipeIngredient: AddToRecipeDto): Promise<RecipeIngredient>{
        return this.recipeIngredientService.addToRecipe(recipeIngredient);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() recipeIngredient: RecipeIngredient): Promise<any>{
        return this.recipeIngredientService.update(id, recipeIngredient);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any>{
        const recipeIngredient = await this.recipeIngredientService.findOne(id);
        if(!recipeIngredient){
            throw new NotFoundException('RecipeIngredient does not exist!');
        }
        return this.recipeIngredientService.delete(id);
    }
}

