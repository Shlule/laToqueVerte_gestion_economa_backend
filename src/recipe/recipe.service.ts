import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { CreateRecipeDto, InsufficientIngredient, InsufficientSubRecipe, RecipeDto } from './recipe.dto';
import { convertUnit } from '../utils/convertUnit';
import { RecipeIngredientService } from '../recipe-ingredient/recipe-ingredient.service';
import { RecipeRepository } from './recipe.repository';
import { RecipeCostService } from './recipeCostService';
import { Ingredient } from '../ingredient/ingredient.entity';
import { SubRecipeService } from '../sub-recipe/sub-recipe.service';
import { SubRecipe } from '../sub-recipe/sub-recipe.entity';

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
    
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,

    
    private subRecipeService: SubRecipeService,

  ) {}

  async findAll(): Promise<RecipeDto[]> {
    return this.recipeRepository.find();
  }

  async findOne(recipeId: string): Promise<RecipeDto> {
    return this.recipeRepository.findOne({where: {id: recipeId}});
  }

  
  async getRecipeByName(name: string): Promise<RecipeDto[]> {
    return this.myRecipeRepository.getRecipesByName(name)
  }

  async create(recipe: CreateRecipeDto): Promise<RecipeDto>{
    const {recipeIngredients, subRecipes} = recipe

    // create of principa recipe
    const savedRecipe = await this.myRecipeRepository.createRecipe(recipe)
    
    // create all RecipeIngredients associated
    if(recipeIngredients?.length){
      await Promise.all(
        recipeIngredients.map(async (ri) => {
          const ingredientData = await this.ingredientRepository.findOne({where:{id: ri.ingredient.id}})
          
          if(!ingredientData){
            throw new BadRequestException(`Invalid ingredient: Ingredient ID ${ri.ingredient.id || 'unknown'} is not valid`);
          }

          await this.recipeIngredientService.create({
            ...ri,
            ingredient: ingredientData,
            recipe: savedRecipe
          }); 

        })
      )
    }

   
    // create all subRecipes associated
    if(subRecipes?.length){
      await Promise.all(
        subRecipes.map(async (sub) => { 
          const childRecipe = await this.recipeRepository.findOne( {where:{id:sub.childRecipe.id}});
          if(!childRecipe){
            throw new BadRequestException(`Invalid sub-recipe: Recipe ID ${sub.childRecipe.id || 'unknown'} is not valid`);
          }
          await this.subRecipeService.create({
            ...sub,
            childRecipe: childRecipe,
            parentRecipe: savedRecipe
          });
        })
      )
    }
    // calculate recipe cost 
    const cost = await this.recipeCostService.calculateRecipeCost(savedRecipe.id);
    savedRecipe.cost = cost;
    const resavedRecipe = await this.myRecipeRepository.saveRecipe(savedRecipe);
    // return recipe Object
    return await this.myRecipeRepository.getRecipe(savedRecipe.id)
      
  }

  

  async update(recipeId: string, updatedData: Partial<RecipeDto>): Promise<RecipeDto> {
    
    if ( updatedData.name || updatedData.quantity) {
        await this.recipeRepository.update(recipeId, { 
            name: updatedData.name, 
            quantity: updatedData.quantity
        });
    }


    return this.recipeRepository.findOne({ 
        where: { id: recipeId }, 
        relations: ['recipeIngredients'] 
    });
  }

  async delete(id: string): Promise<void> {
    await this.recipeRepository.delete(id);
  }

  // TODO - change for th subRecipe Form funciton
  async getInsufficientIngredients(recipeId: string): Promise<InsufficientIngredient[]>{
    
    const recipeIngredients = await this.recipeIngredientService.getAllByRecipeWithStocks(recipeId)
    const insufficientIngredient: InsufficientIngredient[]= []

    for(const recipeIngredient of recipeIngredients){
      const {ingredient, quantityNeeded, unit} = recipeIngredient;
      
      let convertedQuantityNeeded = convertUnit(quantityNeeded,unit,ingredient.unitType);
      if(!ingredient.stocks || ingredient.stocks.length === 0){
        insufficientIngredient.push({
          name: ingredient.name,
          ingredientId: ingredient.id,
          missingQuantity: quantityNeeded,
          unit: unit,
        });
        continue;
      }

      const totalAvailable = ingredient.stocks.reduce(
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

  async getInsufficientSubRecipes(recipeId: string): Promise<InsufficientSubRecipe[]> {
    const subRecipes = await this.subRecipeService.getAllByParentRecipeWithStocks(recipeId);
  
    return subRecipes
      .map(sub => {
        const { childRecipe, quantityNeeded, unit } = sub;
        const converted = convertUnit(quantityNeeded, unit, childRecipe.unitType);
        if (converted == null) return null;
  
        const stocks = childRecipe.stocks ?? [];
        const available = stocks.reduce((sum, s) => sum + s.quantity, 0);
  
        if (available < converted) {
          return {
            name: childRecipe.name,
            childRecipeId: childRecipe.id,
            missingQuantity: converted - available,
            unit: childRecipe.unitType,
          };
        }
  
        return null;
      })
      // this is a type guard safe 
      .filter((r): r is InsufficientSubRecipe => r !== null);
  }
  

}
