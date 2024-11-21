import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ingredient } from "../ingredient/ingredient.entity";
import { Recipe } from "../recipe/recipe.entity";

@Entity()
export class RecipeIngredient{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {onDelete: 'CASCADE'})
    recipe: Recipe;

    @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients, {onDelete: 'CASCADE'})
    ingredient: Ingredient;

    @Column('decimal',{precision: 10 , scale: 2})
    quantityNeeded: number;

    @Column({
        type: 'enum',
        enum: ['kg','g','unit'],
        default: 'unit',
    })
    unit: 'kg' | 'g' | 'unit';
}