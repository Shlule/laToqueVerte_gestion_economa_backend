import { Test, TestingModule } from '@nestjs/testing';
import { RecipeIngredientController } from './recipe-ingredient.controller';

describe('RecipeIngredientController', () => {
  let controller: RecipeIngredientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipeIngredientController],
    }).compile();

    controller = module.get<RecipeIngredientController>(RecipeIngredientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
