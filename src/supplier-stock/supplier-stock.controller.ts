import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { SupplierStock } from './supplier-stock.entity';
import { SupplierStockService } from './supplier-stock.service';
import { SupplierStockDto } from './supplier-stocks.dto';

@Controller('supplier-stocks')
export class SupplierStockController {
  constructor(private readonly stockService: SupplierStockService) {}

  @Get()
  async findAll(): Promise<SupplierStockDto[]> {
    return this.stockService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SupplierStockDto> {
    const stock = await this.stockService.findOne(id);
    if (!stock) {
      throw new NotFoundException('Stock does not exist!');
    } 
    return stock;

  }

  @Get('/byIngredient/:ingredientId')
  async getStockByIngredient(@Param('ingredientId') ingredientId: string):Promise<SupplierStockDto[]>{
    const stocks = await this.stockService.getStockByIngredient(ingredientId);
    return stocks
  }

  @Post()
  async create(@Body() newSupplierStock: SupplierStockDto): Promise<SupplierStockDto> {
    return this.stockService.create(newSupplierStock);
  }

  @Put(':id')
  async update (@Param('id') id: string, @Body() newSupplierStockData: SupplierStockDto): Promise<any> {
    return this.stockService.update(id, newSupplierStockData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const supplierStock = await this.stockService.findOne(id);
    if (!supplierStock) {
      throw new NotFoundException('Stock does not exist!');
    }
    return this.stockService.delete(id);
  }
}
