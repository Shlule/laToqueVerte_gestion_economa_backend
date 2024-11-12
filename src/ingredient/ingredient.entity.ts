import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {RecipeIngredient} from '../recipe-ingredient/recipeIngredient.entity'
import {Stock} from '../stock/stock.entity'

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal',{precision:10, scale:2})
    pricePerKg: number;

    @Column({
        type: 'enum',
        enum: ['kg','g','L','ml','unit'],
        default: 'unit',
    })
    unit: 'kg' | 'g' | 'L' | 'ml' | 'unit';

    @OneToMany(() =>RecipeIngredient,(recipeIngredient) => recipeIngredient.ingredient)
    recipeIngredients: RecipeIngredient[];

    @OneToMany(()=> Stock, (stock) => stock.ingredient)
    stock: Stock[];
}