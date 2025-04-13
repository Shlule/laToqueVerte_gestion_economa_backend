import { Injectable } from "@nestjs/common";
import { SupplierStock } from "./supplier-stock.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class SupplierStockRerpository extends Repository<SupplierStock>{
    constructor(@InjectRepository(SupplierStock) repository: Repository<SupplierStock>){
        super(repository.target, repository.manager, repository.queryRunner);
    }

    async getSupplierStockByIngredient(ingredientId: string):Promise<SupplierStock[]>{
        return await this.manager.getRepository(SupplierStock)
        .createQueryBuilder('SupplierStock')
        .where('SupplierStock.ingredientId =:ingredientId',{ingredientId})
        .orderBy('SupplierStock.expirationDate','ASC')
        .getMany()

    }
}