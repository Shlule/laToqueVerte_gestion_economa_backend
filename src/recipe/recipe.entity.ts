import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {RecipeIngredient} from '../recipe-ingredient/recipeIngredient.entity'

@Entity()
export class Recipe{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({default: false})
    isPossible: boolean;

    @Column('decimal',{precision: 10, scale:2})
    cost:number;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe)
    recipeIngredients: RecipeIngredient[];
}