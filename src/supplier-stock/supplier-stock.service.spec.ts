import { Test, TestingModule } from '@nestjs/testing';
import { SupplierStockService } from './supplier-stock.service';

describe('StockService', () => {
  let service: SupplierStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierStockService],
    }).compile();

    service = module.get<SupplierStockService>(SupplierStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
