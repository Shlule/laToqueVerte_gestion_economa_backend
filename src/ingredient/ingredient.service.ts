import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(Ingredient)
        private ingredientRepository: Repository<Ingredient>,
    ) {}

    async findAll(): Promise<Ingredient[]> {
        return this.ingredientRepository.find();
      }
    
      async findOne(ingredientId: string): Promise<Ingredient> {
        return this.ingredientRepository.findOne({ where: { id: ingredientId } });
      }
    
      async findOneByName(name: string): Promise<Ingredient> {
        return this.ingredientRepository.findOne({ where: {name}});
      }
    
      async create(ingredient: Partial<Ingredient>): Promise<Ingredient> {
        const newIngredient = this.ingredientRepository.create(ingredient);
        return this.ingredientRepository.save(newIngredient);
      }
    
      async update(ingredientId: string, ingredientData: Partial<Ingredient>): Promise<Ingredient> {
        await this.ingredientRepository.update(ingredientId, ingredientData);
        return this.ingredientRepository.findOne({ where: { id: ingredientId } });
      }
    
      async delete(ingredientId: string): Promise<void> {
        await this.ingredientRepository.delete(ingredientId);
      }

}
