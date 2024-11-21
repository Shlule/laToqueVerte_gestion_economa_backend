import { Test, TestingModule } from '@nestjs/testing';
import { RecipeIngredientService } from './recipe-ingredient.service';

describe('RecipeIngredientService', () => {
  let service: RecipeIngredientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecipeIngredientService],
    }).compile();

    service = module.get<RecipeIngredientService>(RecipeIngredientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
