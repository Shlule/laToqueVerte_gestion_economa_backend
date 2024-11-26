import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { Repository } from 'typeorm';
import { IngredientService } from 'src/ingredient/ingredient.service';
import { grammetokg, kgtogramme } from 'src/utils/convertUnit';
import { RecipeIngredientRepository } from './recipe-ingredient.repository';

@Injectable()
export class RecipeIngredientService {
    constructor(
        @InjectRepository(RecipeIngredient)
        private recipeIngredientRepository: Repository<RecipeIngredient>,
        private testRecipeIngredientRepository: RecipeIngredientRepository
    ){}

    async findAll(): Promise<RecipeIngredient[]>{
        return this.recipeIngredientRepository.find()
    }

    async findOne(recipeIngredientId: string): Promise<RecipeIngredient>{
        return this.recipeIngredientRepository.findOne({where:{id: recipeIngredientId}});
    }

    async create(recipeIngredient: Partial<RecipeIngredient>): Promise<RecipeIngredient>{
        // const newRecipeIngredient = this.recipeIngredientRepository.create(recipeIngredient);
        const cost = await this.calculateCost(recipeIngredient);
        recipeIngredient.cost = cost
        return await this.testRecipeIngredientRepository.createRecipeIngredient(recipeIngredient)
        // newRecipeIngredient.cost = cost
        // return this.recipeIngredientRepository.save(newRecipeIngredient);
    }

    async update(recipeIngredientId: string, recipeIngredientData: Partial<RecipeIngredient>): Promise<RecipeIngredient>{
        await this.recipeIngredientRepository.update(recipeIngredientId, recipeIngredientData);
        return this.recipeIngredientRepository.findOne({where: {id: recipeIngredientId}});
    }

    async delete(recipeIngredientId: string): Promise<void> {
        await this.recipeIngredientRepository.delete(recipeIngredientId);
    }

    async calculateCost(recipeIngredient: Partial<RecipeIngredient>){
        const {unitType, pricePerUnit, name} = recipeIngredient.ingredient
        const {quantityNeeded, unit} = recipeIngredient

        let convertedQuantity = quantityNeeded;
        let totalCost = 0;

        if(unitType !== unit){
            if(unitType === 'kg' && unit ==='g'){
                convertedQuantity = grammetokg(convertedQuantity)
            }

            if(unitType === 'g' && unit === 'kg'){
                convertedQuantity= kgtogramme(convertedQuantity)
            }

            if (unitType === 'unit' && unit !== 'unit') {
                console.warn(`Incompatibilité d'unité pour l'ingrédient ${name}: attendu "unit", mais reçu "${unit}"`);
                return null;
            }
   
        }
        totalCost += convertedQuantity * pricePerUnit
        return parseFloat(totalCost.toFixed(2))   
    }

}
