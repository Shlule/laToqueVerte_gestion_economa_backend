import { Recipe } from "../recipe/recipe.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubRecipe{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(() => Recipe, (recipe) => recipe.subRecipe,{onDelete: 'CASCADE'})
    parentRecipe: Recipe;

    @ManyToOne(() => Recipe, {onDelete: 'CASCADE'})
    subRecipe: Recipe;

    @Column('decimal',{precision: 10, scale: 2})
    quantityNeeded: number;
    
    @Column('decimal', {precision: 10, scale: 2})
    cost: number;

    @Column({
        type: 'enum',
        enum: ['kg','g','unit'],
        default: 'unit',
    })
    unit: 'kg'|'g'|'unit'

}