import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientDto } from './Ingredient.dto';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(Ingredient)
        private ingredientRepository: Repository<Ingredient>,
        private eventEmitter: EventEmitter2,
    ) {}

    async findAll(): Promise<IngredientDto[]> {
        return this.ingredientRepository.find();
      }
    
      async findOne(ingredientId: string): Promise<IngredientDto> {
        return this.ingredientRepository.findOne({ where: { id: ingredientId } });
      }
    
      async findOneByName(name: string): Promise<IngredientDto> {
        return this.ingredientRepository.findOne({ where: {name}});
      }
    
      async create(ingredient: Partial<IngredientDto>): Promise<IngredientDto> {
        const newIngredientDto = this.ingredientRepository.create(ingredient);
        return this.ingredientRepository.save(newIngredientDto);
      }
    
      async update(ingredientId: string, ingredientData: Partial<IngredientDto>): Promise<IngredientDto> {
        await this.ingredientRepository.update(ingredientId, ingredientData);
        const ingredientUpdated = await this.ingredientRepository.findOne({where:{id: ingredientId}})
        if(!ingredientUpdated){
          throw new NotFoundException(`ingredient with id ${ingredientId} cannot be found`)
        }
        this.eventEmitter.emit('ingredient.updated',ingredientUpdated)
        return ingredientUpdated

      }
    
      async delete(ingredientId: string): Promise<void> {
        await this.ingredientRepository.delete(ingredientId);
      }

}
