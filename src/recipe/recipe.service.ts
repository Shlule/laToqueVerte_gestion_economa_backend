import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipeIngredient.entity';
import { Stock } from '../stock/stock.entity';
import { CreateRecipeDto } from './recipe.dto';
import { grammetokg, kgtogramme } from 'src/utils/convertUnit';

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

  //@ TODO create a ispossible function to calculate if recipe is possible 
  async create(recipe: CreateRecipeDto): Promise<Recipe> {
    const {name, ingredients} = recipe;
    
    let totalCost = 0;
    let isPossible = false;

    for(const{ingredientId, quantityNeeded} of ingredients){
      const stock = await this.stockRepository.findOne({
        where: {ingredient: {id: ingredientId}},
        relations:['ingredient'],
      });

      if(!stock){
        throw new BadRequestException(`L'ingrédient ${ingredientId} n'existe pas dans le stock.`);
      }
    }
    return null
    
    // const newRecipe = this.recipeRepository.create(recipe.);
    // return this.recipeRepository.save(newRecipe);
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
    const recipeIngredients = await this.recipeIngredientRepository
      .createQueryBuilder('ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .where('ri.recipe.id = :recipeId', { recipeId })
      .getMany();

    let totalCost = 0;
    let hasIncompatibleUnit = false;
    
    
    for(const ri of recipeIngredients){
      const { quantityNeeded, unit} = ri;
      const {pricePerUnit, unitType}= ri.ingredient;

      let convertedQuantity = quantityNeeded; 

      if (unitType === 'unit' && unit !== 'unit') {
      console.warn(`Incompatibilité d'unité pour l'ingrédient ${ri.ingredient.name}: attendu "unit", mais reçu "${unit}"`);
      hasIncompatibleUnit = true;
      return null;
      }

      if(unitType === 'kg' && unit === 'g'){
        convertedQuantity = grammetokg(convertedQuantity)
      }

      if(unitType === 'g' && unit === 'kg'){
        convertedQuantity = kgtogramme(convertedQuantity)
      }
      totalCost += convertedQuantity * pricePerUnit
    }
    return parseFloat(totalCost.toFixed(2));
  }

}
