import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { CreateRecipeDto, InsufficientIngredient } from './recipe.dto';
import { convertUnit } from 'src/utils/convertUnit';
import { RecipeIngredientService } from 'src/recipe-ingredient/recipe-ingredient.service';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { RecipeRepository } from './recipe.repository';

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

  // async update(recipeId: string, updatedData: Partial<Recipe>): Promise<Recipe> {
  
  //   const existingRecipe = await this.recipeRepository.findOne({ where: { id: recipeId }, relations: ['recipeIngredients'] });
  //   if (!existingRecipe) {
  //     throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
  //   }
    
  //   // update simple properties 
  //   if(updatedData.cost || updatedData.name || updatedData.numberOfPieces){
  //     await this.recipeRepository.update(recipeId, { name: updatedData.name, numberOfPieces: updatedData.numberOfPieces });
  //   }

  //   //ANCHOR - update manually this field because typeOrm doesn't allow
  //   // to modify one-to-many relation field

  //   // don't forget to get the ingredient field full of stuff inside recipeIngredientData
  //   if (updatedData.recipeIngredients) {
  
  //     await this.recipeIngredientService.deleteAllByRecipe(recipeId);
  
  //     for (const ingredient of updatedData.recipeIngredients) {
  //       await this.recipeIngredientService.create({
  //         ...ingredient,
  //         recipe: existingRecipe, 
  //       });
  //     }
  //   }
  
  //   const cost = await this.calculateRecipeCost(recipeId);
  //   const insufficientIngredient = await this.getInsufficientIngredient(recipeId);
  
  //   existingRecipe.cost = cost;
  //   existingRecipe.insufficientIngredient = insufficientIngredient;
  //   await this.recipeRepository.save(existingRecipe);
  
  
  //   return this.recipeRepository.findOne({ where: { id: recipeId }, relations: ['recipeIngredients'] });
  // } 

  async update(recipeId: string, updatedData: Partial<Recipe>): Promise<Recipe> {
  
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
        this.calculateRecipeCost(recipeId),
        this.getInsufficientIngredient(recipeId)
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
}
