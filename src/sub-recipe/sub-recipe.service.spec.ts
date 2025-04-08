import { Test, TestingModule } from '@nestjs/testing';
import { SubRecipeService } from './sub-recipe.service';

describe('SubRecipeService', () => {
  let service: SubRecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubRecipeService],
    }).compile();

    service = module.get<SubRecipeService>(SubRecipeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
