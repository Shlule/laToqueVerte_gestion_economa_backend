import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { CreateRecipeDto, RecipeDto } from './recipe.dto';
import { convertUnit } from 'src/utils/convertUnit';
import { RecipeIngredientService } from 'src/recipe-ingredient/recipe-ingredient.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { RecipeRepository } from './recipe.repository';
import { RecipeCostService } from './recipeCostService';

@Injectable()
export class RecipeService {
  constructor(
    //use custom repository for transactionInterceptor use
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private myRecipeRepository: RecipeRepository,

    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    private recipeCostService: RecipeCostService,
    private recipeIngredientService: RecipeIngredientService,
    private ingredientService: IngredientService,

  ) {}

  async findAll(): Promise<RecipeDto[]> {
    return this.myRecipeRepository.getAllRecipes();
  }

  async findOne(recipeId: string): Promise<RecipeDto> {
    return this.myRecipeRepository.getRecipe(recipeId);
  }

  
  async getRecipeByName(name: string): Promise<RecipeDto[]> {
    return this.myRecipeRepository.getRecipesByName(name)
  }

  async create(recipe: CreateRecipeDto): Promise<RecipeDto>{
    const {recipeIngredients} = recipe
    const savedRecipe = await this.myRecipeRepository.createRecipe(recipe)
    if(recipeIngredients){
      for(const ingredient of recipeIngredients){
        const ingredientData = await this.ingredientService.findOne(ingredient.ingredient.id);
        if(!ingredientData){
          throw new BadRequestException(
            `Invalid ingredient: Ingredient ID ${ingredient.ingredient.id || 'unknown'} is not valid`,
          )
        }
        await this.recipeIngredientService.create({
          ...ingredient,
          ingredient: ingredientData,
          recipe: savedRecipe
        });
      }
    }
    
    const cost = await this.recipeCostService.calculateRecipeCost(savedRecipe.id);
    const insufficientIngredient = await this.recipeIngredientService.getInsufficientIngredient(savedRecipe.id);
    savedRecipe.insufficientIngredient = insufficientIngredient;
    savedRecipe.cost = cost;
    await this.myRecipeRepository.saveRecipe(savedRecipe);
    return await this.myRecipeRepository.getRecipe(savedRecipe.id)
      
  }

  

  async update(recipeId: string, updatedData: Partial<RecipeDto>): Promise<RecipeDto> {
  
    const existingRecipe = await this.recipeRepository.findOne({ 
        where: { id: recipeId }, 
        relations: ['recipeIngredients'] 
    });

    if (!existingRecipe) {
        throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }
    
    if (updatedData.cost || updatedData.name || updatedData.numberOfPieces) {
        await this.recipeRepository.update(recipeId, { 
            name: updatedData.name, 
            numberOfPieces: updatedData.numberOfPieces 
        });
    }

    if (updatedData.recipeIngredients) {
        await this.recipeIngredientService.deleteAllByRecipe(recipeId);

        await Promise.all(
            updatedData.recipeIngredients.map(ingredient =>
                this.recipeIngredientService.create({
                    ...ingredient,
                    recipe: existingRecipe, 
                })
            )
        );
    }

    const [cost, insufficientIngredient] = await Promise.all([
        this.recipeCostService.calculateRecipeCost(recipeId),
        this.recipeIngredientService.getInsufficientIngredient(recipeId)
    ]);

    existingRecipe.cost = cost;
    existingRecipe.insufficientIngredient = insufficientIngredient;
    await this.recipeRepository.save(existingRecipe);

    return this.recipeRepository.findOne({ 
        where: { id: recipeId }, 
        relations: ['recipeIngredients'] 
    });
}

  async delete(id: string): Promise<void> {
    await this.myRecipeRepository.deleteRecipe(id);
  }


}
