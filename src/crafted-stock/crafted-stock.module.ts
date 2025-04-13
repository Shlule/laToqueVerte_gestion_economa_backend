import { Module } from '@nestjs/common';
import { CraftedStockController } from './crafted-stock.controller';
import { CraftedStockService } from './crafted-stock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CraftedStock } from './crafted-stock.entity';
import { CraftedStockRerpository } from './crafted-stock.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CraftedStock])],
  controllers: [CraftedStockController],
  providers: [CraftedStockService, CraftedStockRerpository],
  exports: [CraftedStockService]
})
export class CraftedStockModule {}
