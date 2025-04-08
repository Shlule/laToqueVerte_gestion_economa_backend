import { BadRequestException, ConsoleLogger, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { RecipeIngredientDto } from './recipe-ingredient.dto';
import { Repository } from 'typeorm';
import { convertUnit } from 'src/utils/convertUnit';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';
import { Recipe } from 'src/recipe/recipe.entity';
import { RecipeCostService } from 'src/recipe/recipeCostService';
import {AddToRecipeDto} from './recipe-ingredient.dto'
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InsufficientIngredient } from 'src/recipe/recipe.dto';
import { IngredientDto } from 'src/ingredient/Ingredient.dto';

@Injectable()
export class RecipeIngredientService {
    constructor(
        @InjectRepository(RecipeIngredient)
        private recipeIngredientRepository: Repository<RecipeIngredient>,
        private myRecipeIngredientRepository: RecipeIngredientRepository,

        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        private readonly recipeCostService: RecipeCostService,
        

    ){}

    async findAll(): Promise<RecipeIngredientDto[]>{
        return this.recipeIngredientRepository.find({relations:['ingredient','recipe']})
    }

    async findOne(recipeIngredientId: string): Promise<RecipeIngredientDto>{
        return this.recipeIngredientRepository.findOne({where:{id: recipeIngredientId},relations:['ingredient']});
    }

    //ANCHOR - this function is use for only the creation of an entire recipe 
    async create(recipeIngredient: RecipeIngredientDto): Promise<RecipeIngredientDto>{
        const cost = await this.calculateCost(recipeIngredient);
        recipeIngredient.cost = cost
        return await this.myRecipeIngredientRepository.createRecipeIngredient(recipeIngredient)
    }

    //ANCHOR - this is use when adding recipeIngredient in a recipe  
    async addToRecipe(addToRecipeList: AddToRecipeDto[]): Promise<RecipeIngredientDto[]>{
        if (!addToRecipeList || addToRecipeList.length === 0) {
            throw new BadRequestException('The recipe ingredients list is empty');
          }
        
          const recipeId = addToRecipeList[0].recipeId;
        
          const recipe = await this.recipeRepository.findOne({
            where: { id: recipeId },
          });
        
          if (!recipe) {
            throw new NotFoundException(`Recipe with ID ${recipeId} doesn't exist`);
          }
        
          const createdRecipeIngredients = await Promise.all(
            addToRecipeList.map(async (addToRecipe) => {
              return await this.create({
                ...addToRecipe,
                recipe,
              });
            })
          );
        
          const newRecipeCost = await this.recipeCostService.calculateRecipeCost(recipe.id);
          await this.recipeRepository.update(recipe.id, { cost: newRecipeCost });
        
          return createdRecipeIngredients;
 
    }

    async getAllByRecipe(recipeId: string):Promise<RecipeIngredient[]>{
        return this.myRecipeIngredientRepository.getAllByRecipe(recipeId);
    }

    async getAllByRecipeWithStocks(recipeId: string):Promise<RecipeIngredient[]>{
        return this.myRecipeIngredientRepository.getAllByRecipeWithStock(recipeId);
        
    }

    async getAllByIngredient(ingredientId: string):Promise<RecipeIngredient[]>{
        return this.myRecipeIngredientRepository.getAllByIngredient(ingredientId)
    }


    async update(recipeIngredientId: string, recipeIngredientData: Partial<RecipeIngredientDto>): Promise<RecipeIngredientDto>{


        await this.recipeIngredientRepository.update(recipeIngredientId, recipeIngredientData);

        let updatedRecipeIngredient = await this.recipeIngredientRepository.findOne({
            where: { id: recipeIngredientId },
            relations: ['ingredient', 'recipe']
        });

        updatedRecipeIngredient.cost = await this.calculateCost(updatedRecipeIngredient)

        updatedRecipeIngredient = await this.recipeIngredientRepository.save(updatedRecipeIngredient);

        if (updatedRecipeIngredient.recipe) {
            const newRecipeCost = await this.recipeCostService.calculateRecipeCost(updatedRecipeIngredient.recipe.id);
            await this.recipeRepository.update(updatedRecipeIngredient.recipe.id, { cost: newRecipeCost});
        }   

        

        return this.recipeIngredientRepository.findOne({ where: { id: recipeIngredientId } });
    }

    async delete(recipeIngredientId: string): Promise<void> {
        

        // get copy of the delete element
        const recipeIngredient = await this.recipeIngredientRepository.findOne({where:{id: recipeIngredientId}, relations:['recipe']})

        // delete the recipe Ingredient
        await this.recipeIngredientRepository.delete(recipeIngredientId);

        //ANCHOR - trigger recipe cost computation
        const newRecipeCost = await this.recipeCostService.calculateRecipeCost(recipeIngredient.recipe.id)
        await this.recipeRepository.update(recipeIngredient.recipe.id, { cost: newRecipeCost });

        
    }

    async deleteAllByRecipe(recipeId: string): Promise<void> {
        await this.recipeIngredientRepository.delete({ recipe: { id: recipeId } });
    }
   

    async calculateCost(recipeIngredient: RecipeIngredientDto | AddToRecipeDto){
        
        const {unitType, pricePerUnit, name} = recipeIngredient.ingredient
        const {quantityNeeded, unit} = recipeIngredient

        let totalCost = 0;

        const convertedQuantity = convertUnit(quantityNeeded,unit,unitType);

        totalCost += convertedQuantity * pricePerUnit
        return parseFloat(totalCost.toFixed(2))   
    }

    @OnEvent('ingredient.updated')
    async HandleIngredientUpdated(ingredientUpdated: IngredientDto) {
       const impactedRecipeIngredients = await this.getAllByIngredient(ingredientUpdated.id)
       for (const recipeIngredient of impactedRecipeIngredients) {
        this.update(recipeIngredient.id,recipeIngredient)
       }
    }

}
