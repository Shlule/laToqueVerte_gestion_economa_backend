import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { CreateRecipeDto, InsufficientIngredient, RecipeDto } from './recipe.dto';
import { convertUnit } from 'src/utils/convertUnit';
import { RecipeIngredientService } from 'src/recipe-ingredient/recipe-ingredient.service';
import { RecipeRepository } from './recipe.repository';
import { RecipeCostService } from './recipeCostService';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { SubRecipeService } from 'src/sub-recipe/sub-recipe.service';
import { SubRecipe } from 'src/sub-recipe/sub-recipe.entity';

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
    return this.myRecipeRepository.getAllRecipes();
  }

  async findOne(recipeId: string): Promise<RecipeDto> {
    return this.myRecipeRepository.getRecipe(recipeId);
  }

  
  async getRecipeByName(name: string): Promise<RecipeDto[]> {
    return this.myRecipeRepository.getRecipesByName(name)
  }

  async create(recipe: CreateRecipeDto): Promise<RecipeDto>{
    const {recipeIngredients , subRecipes} = recipe

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
      console.log('je possede des subRecipes ')
      await Promise.all(
        subRecipes.map(async (sub) => { 
          const childRecipe = await this.myRecipeRepository.getRecipe(sub.subRecipe.id);
          console.log('bonjour')
          console.log(childRecipe)
          if(!childRecipe){
            throw new BadRequestException(`Invalid sub-recipe: Recipe ID ${sub.subRecipe.id || 'unknown'} is not valid`);
          }
          await this.subRecipeService.create({
            ...sub,
            subRecipe: childRecipe,
            parentRecipe: savedRecipe
          });
        })
      )
    }
    
    console.log("j'ais fini de creer les subreicpe")
    // calculate recipe cost 
    const cost = await this.recipeCostService.calculateRecipeCost(savedRecipe.id);
    savedRecipe.cost = cost;
    await this.myRecipeRepository.saveRecipe(savedRecipe);

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
