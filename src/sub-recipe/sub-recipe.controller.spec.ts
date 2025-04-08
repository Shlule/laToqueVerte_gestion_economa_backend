import { Test, TestingModule } from '@nestjs/testing';
import { SubRecipeController } from './sub-recipe.controller';

describe('SubRecipeController', () => {
  let controller: SubRecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubRecipeController],
    }).compile();

    controller = module.get<SubRecipeController>(SubRecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
