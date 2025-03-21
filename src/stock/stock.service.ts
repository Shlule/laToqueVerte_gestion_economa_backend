import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './stock.entity';
import { Repository } from 'typeorm';
import { StockDto } from './stocks.dto';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock)
        private stockRepository: Repository<Stock>,
    ){}

    async findAll():Promise<StockDto[]>{
        return this.stockRepository.find({relations:['ingredient']});
    }

    async findOne(stockId: string): Promise<StockDto>{
        return this.stockRepository.findOne({where: {id: stockId}})
    }

    async getStockByIngredient(ingredientId: string):Promise<StockDto[]>{
        const ingredientList = this.stockRepository
        .createQueryBuilder('stock')
        .where('stock.ingredientId = :ingredientId',{ingredientId})
        .orderBy('stock.expirationDate', 'ASC');

        return await ingredientList.getMany()
    }

    async create(stock: Partial<StockDto>): Promise<StockDto>{
        const newStock = this.stockRepository.create(stock);
        return this.stockRepository.save(newStock)
    }

    async update(stockId: string, stockData: Partial<StockDto>){
        await this.stockRepository.update(stockId,stockData);
        return this.stockRepository.findOne({where: {id: stockId}});
    }

    async delete(stockId: string): Promise<void>{
        await this.stockRepository.delete(stockId);
    }
}
