import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { Stock } from '../stock/stock.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  async findOne(id: string): Promise<Recipe> {
    return this.recipeRepository.findOne({ where: { id } });
  }

  async findOne_by_name(name: string): Promise<Recipe> {
    return this.recipeRepository.findOne({ where: {name: name}});
  }

  async create(recipe: Partial<Recipe>): Promise<Recipe> {
    const newRecipe = this.recipeRepository.create(recipe);
    return this.recipeRepository.save(newRecipe);
  }

  async update(id: string, user: Partial<Recipe>): Promise<Recipe> {
    await this.recipeRepository.update(id, user);
    return this.recipeRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.recipeRepository.delete(id);
  }

  // Méthode pour calculer le coût total d'une recette
  async calculateRecipeCost(recipeId: string): Promise<number> {
    const result = await this.recipeIngredientRepository
      .createQueryBuilder('ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .select('SUM(ri.quantityNeeded * ingredient.pricePerKg)', 'totalCost')
      .where('ri.recipe.id = :recipeId', { recipeId })
      .getRawOne();

    return parseFloat(result.totalCost);
  }
}
