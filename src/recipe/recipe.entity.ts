import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {RecipeIngredient} from '../recipe-ingredient/recipeIngredient.entity'
import { SubRecipe } from "../sub-recipe/sub-recipe.entity";
@Entity()

//TODO -  get  cost field here and do not just calculate cost in front end 
// because later create history of recipe for see the evolution of 
// recipe cost 
export class Recipe{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal',{precision: 10, scale:2})
    quantity: number
    
    @Column({
        type: 'enum',
        enum: ['kg','g','unit'],
        default: 'unit',
    })
    unitType: 'kg' | 'g' | 'unit';

    @Column('decimal',{precision: 10, scale:2, nullable: true})
    cost:number;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, {nullable: true, cascade: true ,onDelete:'SET NULL'})
    recipeIngredients: RecipeIngredient[];

    @OneToMany(() => SubRecipe, (subRecipe) => subRecipe.parentRecipe, {nullable: true, cascade: true ,onDelete:'SET NULL'})
    subRecipe: SubRecipe[];

    
}