import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ingredient } from "src/ingredient/ingredient.entity";
import { Recipe } from "src/recipe/recipe.entity";

@Entity()
export class RecipeIngredient{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients)
    recipe: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
    ingredient: Ingredient;

    @Column('decimal',{precision: 10 , scale: 2})
    quantityNeeded: number;
}