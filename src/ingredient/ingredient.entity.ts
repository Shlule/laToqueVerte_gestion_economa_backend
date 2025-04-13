import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import {RecipeIngredient} from '../recipe-ingredient/recipeIngredient.entity'
import {SupplierStock} from '../supplier-stock/supplier-stock.entity'

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal',{precision:10, scale:2})
    pricePerUnit: number;

    @Column({
        type: 'enum',
        enum: ['kg','g','unit'],
        default: 'unit',
    })
    unitType: 'kg' | 'g' | 'unit';

    @Column()
    fournisseur: string;

    @OneToMany(() =>RecipeIngredient,(recipeIngredient) => recipeIngredient.ingredient)
    recipeIngredients: RecipeIngredient[];

    @OneToMany(()=> SupplierStock, (stock) => stock.ingredient)
    stock: SupplierStock[];
}