import { Module } from '@nestjs/common';
import { SupplierStockService } from './supplier-stock.service';
import { SupplierStockController } from './supplier-stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierStock } from './supplier-stock.entity';
import { SupplierStockRerpository } from './supplier-stock.repository';

@Module({
  imports:[TypeOrmModule.forFeature([SupplierStock])],
  providers: [SupplierStockService, SupplierStockRerpository],
  controllers: [SupplierStockController],
  exports: [SupplierStockService]
})
export class SupplierStockModule {}
