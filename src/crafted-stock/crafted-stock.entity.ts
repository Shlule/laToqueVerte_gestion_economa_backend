import { Ingredient } from "../ingredient/ingredient.entity";
import { Recipe } from "../recipe/recipe.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CraftedStock{
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ManyToOne(()=> Recipe, (recipe) => recipe.stocks, {onDelete:'CASCADE'})
    recipe: Recipe;

    @Column('decimal',{precision: 10, scale: 2})
    quantity: number
    
    @Column()
    creationDate: Date

    @Column({
        type: 'enum',
        enum:['kg','g','unit'],
        default:['unit'],
    })
    unit: 'kg'| 'g'| 'unit';
}