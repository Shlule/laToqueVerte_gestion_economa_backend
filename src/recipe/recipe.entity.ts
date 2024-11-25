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

    @Column('int')
    numberOfPieces: number

    @Column('decimal',{precision: 10, scale:2, nullable: true})
    cost:number;

    @OneToMany(() => RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe, {nullable: true, cascade: true, eager: true})
    recipeIngredients: RecipeIngredient[];
}