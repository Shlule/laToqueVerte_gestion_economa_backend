import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { Stock } from '../stock/stock.entity';
import { CreateRecipeDto, InsufficientIngredient } from './recipe.dto';
import { convertUnit, grammetokg, kgtogramme } from 'src/utils/convertUnit';
import { v4 as uuidv4 } from 'uuid';
import { RecipeIngredientService } from 'src/recipe-ingredient/recipe-ingredient.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { RecipeRepository } from './recipe.repository';
import { error } from 'console';
import { Ingredient } from 'src/ingredient/ingredient.entity';

@Injectable()
export class RecipeService {
  constructor(
    //use custom repository for transactionInterceptor use
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private myRecipeRepository: RecipeRepository,

    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    private recipeIngredientService: RecipeIngredientService,
    private ingredientService: IngredientService,

    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.myRecipeRepository.getAllRecipes();
  }

  async findOne(recipeId: string): Promise<Recipe> {
    return this.myRecipeRepository.getRecipe(recipeId);
  }

  
  async getRecipeByName(name: string): Promise<Recipe[]> {
    return this.myRecipeRepository.getRecipesByName(name)
  }

  async create(recipe: CreateRecipeDto): Promise<Recipe>{
    const {recipeIngredients} = recipe
    const savedRecipe = await this.myRecipeRepository.createRecipe(recipe)
    if(recipeIngredients){
      for(const ingredient of recipeIngredients){
        const ingredientData = await this.ingredientService.findOne(ingredient.ingredientId);
        if(!ingredientData){
          throw new BadRequestException(
            `Invalid ingredient: Ingredient ID ${ingredient.ingredientId || 'unknown'} is not valid`,
          )
        }
        await this.recipeIngredientService.create({
          ...ingredient,
          ingredient: ingredientData,
          recipe: savedRecipe
        });
      }
    }
    
    const cost = await this.calculateRecipeCost(savedRecipe.id);
    const insufficientIngredient = await this.getInsufficientIngredient(savedRecipe.id);
    savedRecipe.insufficientIngredient = insufficientIngredient;
    savedRecipe.cost = cost;
    await this.myRecipeRepository.saveRecipe(savedRecipe);
    return await this.myRecipeRepository.getRecipe(savedRecipe.id)
      
  }

  async update(recipeId: string, updatedData: Partial<Recipe>): Promise<Recipe> {
    await this.recipeRepository.update(recipeId, updatedData);

    if(updatedData.recipeIngredients){
      const updatedRecipe = await this.recipeRepository.findOne({where: {id: recipeId}});

      const insufficientIngredient = await this.getInsufficientIngredient(recipeId);
      const cost = await this.calculateRecipeCost(recipeId);

      updatedRecipe.insufficientIngredient = insufficientIngredient;
      updatedRecipe.cost = cost;

      return this.recipeRepository.save(updatedRecipe)
    }
    
    return this.recipeRepository.findOne({ where: { id: recipeId } });
  }

  async delete(id: string): Promise<void> {
    await this.myRecipeRepository.deleteRecipe(id);
  }

  async calculateRecipeCost(recipeId: string):Promise<number>{
    const recipe = await this.myRecipeRepository.getRecipe(recipeId)

    const totalCost = recipe.recipeIngredients.reduce((sum,ingredient) =>{
      return sum + Number(ingredient.cost);
    }, 0)

    recipe.cost = totalCost;
    return totalCost;
  }


  // must use the service of recipeIngredient 
  async getInsufficientIngredient(recipeId: string): Promise<InsufficientIngredient[]>{
    console.log('prout')
    const recipeIngredients = await this.recipeIngredientService.getAllByRecipeWithStocks(recipeId)
    const insufficientIngredient: InsufficientIngredient[]= []

    for(const recipeIngredient of recipeIngredients){
      const {ingredient, quantityNeeded, unit} = recipeIngredient;
      
      let convertedQuantityNeeded = convertUnit(quantityNeeded,unit,ingredient.unitType);
      console.log(convertedQuantityNeeded)
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
    console.log(insufficientIngredient)
    return insufficientIngredient
  }
}
