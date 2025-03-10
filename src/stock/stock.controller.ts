import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { Stock } from './stock.entity';
import { StockService } from './stock.service';
import { StockDto } from './stocks.dto';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  async findAll(): Promise<StockDto[]> {
    return this.stockService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<StockDto> {
    const user = await this.stockService.findOne(id);
    if (!user) {
      throw new NotFoundException('Stock does not exist!');
    } else {
      return user;
    }
  }

  @Get('/byIngredient/:ingredientId')
  async getStockByIngredient(@Param('ingredientId') ingredientId: string):Promise<StockDto[]>{
    const stocks = await this.stockService.getStockByIngredient(ingredientId);
    return stocks
  }

  @Post()
  async create(@Body() ingredient: StockDto): Promise<StockDto> {
    return this.stockService.create(ingredient);
  }

  @Put(':id')
  async update (@Param('id') id: string, @Body() ingredient: StockDto): Promise<any> {
    return this.stockService.update(id, ingredient);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const user = await this.stockService.findOne(id);
    if (!user) {
      throw new NotFoundException('Stock does not exist!');
    }
    return this.stockService.delete(id);
  }
}
