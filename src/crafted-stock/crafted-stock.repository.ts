import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CraftedStock } from "./crafted-stock.entity";


@Injectable()
export class CraftedStockRerpository extends Repository<CraftedStock>{
    constructor(@InjectRepository(CraftedStock) repository: Repository<CraftedStock>){
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getCraftedStockByRecipe(recipeId: string):Promise<CraftedStock[]>{
        return await this.manager.getRepository(CraftedStock)
        .createQueryBuilder('CraftedStock')
        .where('CraftedStock.ingredientId =:recipeId',{recipeId})
        .orderBy('CraftedStock.creationDate','ASC')
        .getMany()

    }
}