import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, SerializeOptions} from '@nestjs/common';
import { RecipeIngredient } from './recipeIngredient.entity';
import { RecipeIngredientService } from './recipe-ingredient.service';
import MyNotFoundError from '../common/execption/notFound.execption';
import { AddToRecipeDto, RecipeIngredientDto } from './recipe-ingredient.dto';

@Controller('recipe-ingredients')
export class RecipeIngredientController {
    constructor(private readonly recipeIngredientService: RecipeIngredientService){}

    @Get()
    // @SerializeOptions({type: RecipeIngredientDto})
    async findAll(): Promise<RecipeIngredientDto[]>{
        return this.recipeIngredientService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<RecipeIngredientDto>{
        const recipeIngredient = await this.recipeIngredientService.findOne(id);
        if(!recipeIngredient){
            throw new NotFoundException('RecipeIngredient does not exist!');
        } 
         return recipeIngredient;
        
    }

    @Get('/byRecipe/:recipeId')
    async getAllByRecipe(@Param('recipeId') recipeId:string):Promise<RecipeIngredientDto[]>{
        const recipeIngredients = await this.recipeIngredientService.getAllByRecipe(recipeId);
        if(!recipeIngredients){
            throw new MyNotFoundError('recipe',recipeId);
        }
        return recipeIngredients;
        
    }

    @Post()
    async addToRecipe(@Body() recipeIngredientList: AddToRecipeDto[]): Promise<RecipeIngredientDto[]>{
        return this.recipeIngredientService.addToRecipe(recipeIngredientList);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() recipeIngredient: RecipeIngredientDto): Promise<any>{
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

