import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {RecipeIngredient} from '../recipe-ingredient/recipeIngredient.entity'
import { InsufficientIngredient } from "./recipe.dto";
@Entity()
export class Recipe{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    // use json more than boolean for more explicit information why
    // recipe is not possible
    @Column({type: 'jsonb', nullable: true})
    insufficientIngredient: InsufficientIngredient[];

    @Column('int')
    numberOfPieces: number

    @Column('decimal',{precision: 10, scale:2, nullable: true})
    cost:number;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, {nullable: true, cascade: true, eager: true ,onDelete:'SET NULL'})
    recipeIngredients: RecipeIngredient[];
}