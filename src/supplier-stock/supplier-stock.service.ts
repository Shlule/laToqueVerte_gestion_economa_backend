import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierStock } from './supplier-stock.entity';
import { Repository } from 'typeorm';
import { SupplierStockDto } from './supplier-stocks.dto';
import { SupplierStockRerpository } from './supplier-stock.repository';

@Injectable()
export class SupplierStockService {
    constructor(
        @InjectRepository(SupplierStock)
        // must import stockRepository for mystockRepository to work
        private stockRepository: Repository<SupplierStock>,
        private myStockRepository: SupplierStockRerpository,
    ){}

    async findAll():Promise<SupplierStockDto[]>{
        return this.myStockRepository.find({relations:['ingredient']});
    }

    async findOne(stockId: string): Promise<SupplierStockDto>{
        return this.myStockRepository.findOne({where: {id: stockId}})
    }

    async getStockByIngredient(ingredientId: string):Promise<SupplierStockDto[]>{
        return this.myStockRepository.getSupplierStockByIngredient(ingredientId)
    }

    async create(stock: Partial<SupplierStockDto>): Promise<SupplierStockDto>{
        const newStock = this.myStockRepository.create(stock);
        return this.myStockRepository.save(newStock)
    }

    async update(stockId: string, stockData: Partial<SupplierStockDto>){
        await this.myStockRepository.update(stockId,stockData);
        return this.myStockRepository.findOne({where: {id: stockId}});
    }

    async delete(stockId: string): Promise<void>{
        await this.myStockRepository.delete(stockId);
    }
}
