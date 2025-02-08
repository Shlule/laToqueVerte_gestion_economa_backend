import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { Repository } from 'typeorm';
import { convertUnit } from 'src/utils/convertUnit';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';
import { Recipe } from 'src/recipe/recipe.entity';
import { RecipeCostService } from 'src/recipe/recipeCostService';
import {AddToRecipeDto} from './recipe-ingredient.dto'
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { IngredientService } from 'src/ingredient/ingredient.service';

@Injectable()
export class RecipeIngredientService {
    constructor(
        @InjectRepository(RecipeIngredient)
        private recipeIngredientRepository: Repository<RecipeIngredient>,
        private myRecipeIngredientRepository: RecipeIngredientRepository,

        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        private readonly recipeCostService: RecipeCostService,

        @InjectRepository(Ingredient)
        private readonly ingredientRepository: Repository<Ingredient>,

    ){}

    async findAll(): Promise<RecipeIngredient[]>{
        return this.recipeIngredientRepository.find({relations:['ingredient','recipe']})
    }

    async findOne(recipeIngredientId: string): Promise<RecipeIngredient>{
        return this.recipeIngredientRepository.findOne({where:{id: recipeIngredientId},relations:['ingredient']});
    }

    //ANCHOR - this function is use for only the creation a the entire recipe 
    async create(recipeIngredient: Partial<RecipeIngredient>): Promise<RecipeIngredient>{
        const cost = await this.calculateCost(recipeIngredient);
        recipeIngredient.cost = cost
        return await this.myRecipeIngredientRepository.createRecipeIngredient(recipeIngredient)
    }

    //ANCHOR - this is for trigger the computation of the recipe cost  
    async addToRecipe(addToRecipe: AddToRecipeDto): Promise<RecipeIngredient>{
    const [ingredient, recipe] = await Promise.all([
        this.ingredientRepository.findOne({ where: { id: addToRecipe.ingredientId } }),
        this.recipeRepository.findOne({ where: { id: addToRecipe.recipeId } })
    ]);

    if (!ingredient) {
        throw new NotFoundException(` ${addToRecipe.ingredientId} ingredient doesn't exist`);
    }
    if (!recipe) {
        throw new NotFoundException(` ${addToRecipe.recipeId} recipe doesn't exist`);
    }

    const createdRecipeIngredient = await this.create({
        ...addToRecipe,
        ingredient,
        recipe
    });

    if (!createdRecipeIngredient) {
        throw new Error('Error during the creation of th recipe Ingredient');
    }


    const newRecipeCost = await this.recipeCostService.calculateRecipeCost(recipe.id);

    await this.recipeRepository.update(recipe.id, { cost: newRecipeCost });

    return createdRecipeIngredient;
 
}

    async getAllByRecipe(recipeId: string):Promise<RecipeIngredient[]>{
        return this.myRecipeIngredientRepository.getAllByRecipe(recipeId);
    }

    async getAllByRecipeWithStocks(recipeId: string):Promise<RecipeIngredient[]>{
        return this.myRecipeIngredientRepository.getAllByRecipeWithStock(recipeId);
        
    }

    
    async update(recipeIngredientId: string, recipeIngredientData: Partial<RecipeIngredient>): Promise<RecipeIngredient>{

        await this.recipeIngredientRepository.update(recipeIngredientId, recipeIngredientData);

        await this.recipeIngredientRepository.update(recipeIngredientId, recipeIngredientData);

        let updatedRecipeIngredient = await this.recipeIngredientRepository.findOne({
            where: { id: recipeIngredientId },
            relations: ['ingredient', 'recipe']
        });

        updatedRecipeIngredient.cost = await this.calculateCost(updatedRecipeIngredient)


        updatedRecipeIngredient = await this.recipeIngredientRepository.save(updatedRecipeIngredient);

        if (updatedRecipeIngredient.recipe) {
            const newCost = await this.recipeCostService.calculateRecipeCost(updatedRecipeIngredient.recipe.id);
            await this.recipeRepository.update(updatedRecipeIngredient.recipe.id, { cost: newCost });
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
   

    async calculateCost(recipeIngredient: Partial<RecipeIngredient>){
        
        const {unitType, pricePerUnit, name} = recipeIngredient.ingredient
        const {quantityNeeded, unit} = recipeIngredient

        let totalCost = 0;

        const convertedQuantity = convertUnit(quantityNeeded,unit,unitType);

        totalCost += convertedQuantity * pricePerUnit
        return parseFloat(totalCost.toFixed(2))   
    }

}
