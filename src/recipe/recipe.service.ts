import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { CreateRecipeDto, InsufficientIngredient, RecipeDto } from './recipe.dto';
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
    savedRecipe.cost = cost;
    await this.myRecipeRepository.saveRecipe(savedRecipe);
    return await this.myRecipeRepository.getRecipe(savedRecipe.id)
      
  }

  

  async update(recipeId: string, updatedData: Partial<RecipeDto>): Promise<RecipeDto> {
    
    if ( updatedData.name || updatedData.numberOfPieces) {
        await this.recipeRepository.update(recipeId, { 
            name: updatedData.name, 
            numberOfPieces: updatedData.numberOfPieces 
        });
    }


    return this.recipeRepository.findOne({ 
        where: { id: recipeId }, 
        relations: ['recipeIngredients'] 
    });
  }

  async delete(id: string): Promise<void> {
    await this.myRecipeRepository.deleteRecipe(id);
  }

  async getInsufficientIngredients(recipeId: string): Promise<InsufficientIngredient[]>{
    
    const recipeIngredients = await this.recipeIngredientService.getAllByRecipeWithStocks(recipeId)
    const insufficientIngredient: InsufficientIngredient[]= []

    for(const recipeIngredient of recipeIngredients){
      const {ingredient, quantityNeeded, unit} = recipeIngredient;
      
      let convertedQuantityNeeded = convertUnit(quantityNeeded,unit,ingredient.unitType);
      if(!ingredient.stock || ingredient.stock.length === 0){
        insufficientIngredient.push({
          name: ingredient.name,
          ingredientId: ingredient.id,
          missingQuantity: quantityNeeded,
          unit: unit,
        });
        continue;
      }

      const totalAvailable = ingredient.stock.reduce(
        (sum,stock) => sum + stock.quantity, 0
      )
      if(totalAvailable < convertedQuantityNeeded){
        const missingQuantity = convertedQuantityNeeded - totalAvailable; 
        insufficientIngredient.push({
          name: ingredient.name,
          ingredientId: ingredient.id,
          missingQuantity: missingQuantity,
          unit: ingredient.unitType

        })
      }
    }
    return insufficientIngredient
  }

    // async getInsufficientIngredient(recipeId: string){
    //   return this.myRecipeRepository.getInsufficientIngredients(recipeId)
    // }
  

}
