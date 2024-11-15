import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { Stock } from './stock.entity';
import { StockService } from './stock.service';

@Controller('Stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  //get all users
  @Get()
  async findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  //get user by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Stock> {
    const user = await this.stockService.findOne(id);
    if (!user) {
      throw new NotFoundException('Stock does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  async create(@Body() ingredient: Stock): Promise<Stock> {
    return this.stockService.create(ingredient);
  }

  //update user
  @Put(':id')
  async update (@Param('id') id: string, @Body() ingredient: Stock): Promise<any> {
    return this.stockService.update(id, ingredient);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    //handle error if user does not exist
    const user = await this.stockService.findOne(id);
    if (!user) {
      throw new NotFoundException('Stock does not exist!');
    }
    return this.stockService.delete(id);
  }
}
