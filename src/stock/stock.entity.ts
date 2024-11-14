import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ingredient } from "../ingredient/ingredient.entity";

@Entity()
export class Stock{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> Ingredient,(ingredient)=> ingredient.stock)
    ingredient: Ingredient;

    @Column('decimal', {precision: 10, scale: 2})
    quantity: number

    @Column()
    expirationDate: Date

    @Column({
        type: 'enum',
        enum: ['kg','g','unit'],
        default: 'unit',
    })
    unit: 'kg' | 'g' | 'unit';

}