import { Test, TestingModule } from '@nestjs/testing';
import { CraftedStockService } from './crafted-stock.service';

describe('CraftedStockService', () => {
  let service: CraftedStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CraftedStockService],
    }).compile();

    service = module.get<CraftedStockService>(CraftedStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
