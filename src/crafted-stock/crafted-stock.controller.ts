import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CraftedStockService } from './crafted-stock.service';
import { CraftedStockDto } from './crafted-stock.dto';

@Controller('crafted-stocks')
export class CraftedStockController {
    constructor(private readonly craftedStockService: CraftedStockService){}

    @Get()
        async findAll(): Promise<CraftedStockDto[]> {
            return this.craftedStockService.findAll();
        }
    

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CraftedStockDto>{
        const craftedStock = await this.craftedStockService.findOne(id);

        if(!craftedStock){
            throw new NotFoundException(`CraftedStocks does not exist with id ${id}`)
        }
        return craftedStock
       
    }

    @Get('/byRecipe/:recipeId')
    async getCraftedStocksByRecipe(@Param('recipeId') recipeId: string): Promise<CraftedStockDto[]>{
        const craftedStocks = await this.craftedStockService.getStockByRecipe(recipeId)
        return craftedStocks
    }

    @Post()
    async create(@Body() newCraftedStock: CraftedStockDto): Promise<CraftedStockDto>{
        return this.craftedStockService.create(newCraftedStock)
    }

    @Put('id')
    async update(@Param('id') id: string, @Body() newCraftedStockData: CraftedStockDto):Promise<CraftedStockDto>{
        return this.craftedStockService.update(id, newCraftedStockData)
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        const craftedStock = await this.craftedStockService.findOne(id);
        if(!craftedStock){
            throw new NotFoundException('Stock does not exist!')
        }
        return this.craftedStockService.delete(id)
    }
}
