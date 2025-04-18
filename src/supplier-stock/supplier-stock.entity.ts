import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Ingredient } from "../ingredient/ingredient.entity";
// maybe think about lots 
// for example 20 farine bag of 1 kg
@Entity()
export class SupplierStock{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> Ingredient,(ingredient)=> ingredient.stocks, {onDelete:'CASCADE'})
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