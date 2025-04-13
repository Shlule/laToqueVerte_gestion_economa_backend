import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CraftedStock } from './crafted-stock.entity';
import { CraftedStockDto } from './crafted-stock.dto';
import { CraftedStockRerpository } from './crafted-stock.repository';

@Injectable()
export class CraftedStockService {

    constructor(
        @InjectRepository(CraftedStock)
        private craftedStockRepository: Repository<CraftedStock>,
        private myCraftedStockRepository: CraftedStockRerpository,
    ){}

    async findAll(): Promise<CraftedStockDto[]>{
        return this.myCraftedStockRepository.find({relations:['recipe']})
    }

    async findOne(craftedStockId: string): Promise<CraftedStockDto>{
        return this.myCraftedStockRepository.findOne({where: {id: craftedStockId}})
    }

    async getStockByRecipe(recipeId: string): Promise<CraftedStockDto[]>{
        return this.myCraftedStockRepository.getCraftedStockByRecipe(recipeId)
    }

    async create(craftedStock: Partial<CraftedStockDto>): Promise<CraftedStockDto>{
        const newCraftedStock = this.myCraftedStockRepository.create(craftedStock);
        return this.myCraftedStockRepository.save(newCraftedStock);
    }

    async update(craftedStockId: string, craftedStockData: Partial<CraftedStockDto>){
        await this.myCraftedStockRepository.update(craftedStockId, craftedStockData);
        return this.myCraftedStockRepository.findOne({where: {id:craftedStockId}});
    }

    async delete(craftedStockId: string): Promise<void>{
        await this.myCraftedStockRepository.delete(craftedStockId)
    }
}
