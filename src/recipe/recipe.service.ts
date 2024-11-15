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

  async findOne(recipeId: string): Promise<Recipe> {
    return this.recipeRepository.findOne({ where: { id: recipeId } });
  }

  async findOne_by_name(name: string): Promise<Recipe> {
    return this.recipeRepository.findOne({ where: {name: name}});
  }

  //@ TODO create a ispossible function to calculate if recipe is possible 
  async create(recipe: Partial<Recipe>): Promise<Recipe> {
    const newRecipe = this.recipeRepository.create(recipe);
    const savedRecipe = await this.recipeRepository.save(newRecipe);
    const possible = await this.isPossible(savedRecipe.id);
    const cost = await this.calculateRecipeCost(savedRecipe.id);

    savedRecipe.cost = cost;
    savedRecipe.isPossible = possible;

    return this.recipeRepository.save(savedRecipe);
  }

  async update(recipeId: string, updatedData: Partial<Recipe>): Promise<Recipe> {
    await this.recipeRepository.update(recipeId, updatedData);

    if(updatedData.recipeIngredients){
      const updatedRecipe = await this.recipeRepository.findOne({where: {id: recipeId}});

      const possible = await this.isPossible(recipeId);
      const cost = await this.calculateRecipeCost(recipeId);

      updatedRecipe.isPossible = possible;
      updatedRecipe.cost = cost;

      return this.recipeRepository.save(updatedRecipe)
    }
    
    return this.recipeRepository.findOne({ where: { id: recipeId } });
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

  async isPossible(recipeId: string): Promise<boolean>{
    const recipeIngredients = await this.recipeIngredientRepository
      .createQueryBuilder('ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .leftJoinAndSelect('ingredient.stocks', 'stock')
      .where('re.recipe.id = recipeId', {recipeId})
      .getMany();

    for(const ri of recipeIngredients){
      const {quantityNeeded, unit} = ri;
      const ingredientStock = ri.ingredient.stock;

      // calculate all available quantity in stocks for this ingredients
      let totalAvailable = 0;
      for(const stock of ingredientStock){
        if (stock.unit === unit) {
          totalAvailable += stock.quantity;
        } else if (stock.unit === 'g' && unit === 'kg') {
          totalAvailable += stock.quantity / 1000; // Convertit g -> kg
        } else if (stock.unit === 'kg' && unit === 'g') {
          totalAvailable += stock.quantity * 1000; // Convertit kg -> g
        } else {
          console.warn(`Incompatibilité d'unité pour l'ingrédient ${ri.ingredient.name}`);
        }
      }
      if(totalAvailable < quantityNeeded){
        return false;
      }
    }
    return true;
  }

}
