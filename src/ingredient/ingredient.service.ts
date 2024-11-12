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
    
      async findOne(id: string): Promise<Ingredient> {
        return this.ingredientRepository.findOne({ where: { id } });
      }
    
      async findOne_by_name(name: string): Promise<Ingredient> {
        return this.ingredientRepository.findOne({ where: {name}});
      }
    
      async create(ingredient: Partial<Ingredient>): Promise<Ingredient> {
        const newIngredient = this.ingredientRepository.create(ingredient);
        return this.ingredientRepository.save(newIngredient);
      }
    
      async update(id: string, user: Partial<Ingredient>): Promise<Ingredient> {
        await this.ingredientRepository.update(id, user);
        return this.ingredientRepository.findOne({ where: { id } });
      }
    
      async delete(id: string): Promise<void> {
        await this.ingredientRepository.delete(id);
      }

}
