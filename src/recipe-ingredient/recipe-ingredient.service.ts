import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipeIngredientService {
    constructor(
        @InjectRepository(RecipeIngredient)
        private recipeIngredientRepository: Repository<RecipeIngredient>,
    ){}

    async findAll(): Promise<RecipeIngredient[]>{
        return this.recipeIngredientRepository.find()
    }

    async findOne(recipeIngredientId: string): Promise<RecipeIngredient>{
        return this.recipeIngredientRepository.findOne({where:{id: recipeIngredientId}});
    }

    async create(recipeIngredient: Partial<RecipeIngredient>): Promise<RecipeIngredient>{
        const newRecipeIngredient = this.recipeIngredientRepository.create(recipeIngredient);
        return this.recipeIngredientRepository.save(newRecipeIngredient);
    }

    async update(recipeIngredientId: string, recipeIngredientData: Partial<RecipeIngredient>): Promise<RecipeIngredient>{
        await this.recipeIngredientRepository.update(recipeIngredientId, recipeIngredientData);
        return this.recipeIngredientRepository.findOne({where: {id: recipeIngredientId}});
    }

    async delete(recipeIngredientId: string): Promise<void> {
        await this.recipeIngredientRepository.delete(recipeIngredientId);
    }

    async calculateCost(){}
}
