import { Test, TestingModule } from '@nestjs/testing';
import { CraftedStockController } from './crafted-stock.controller';

describe('CraftedStockController', () => {
  let controller: CraftedStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CraftedStockController],
    }).compile();

    controller = module.get<CraftedStockController>(CraftedStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
