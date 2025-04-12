import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubRecipe } from './sub-recipe.entity';
import { Repository } from 'typeorm';
import { SubRecipeDto } from './sub-recipe.dto';
import { RecipeCostService } from '../recipe/recipeCostService';
import { Recipe } from '../recipe/recipe.entity';
import {  SubRecipeRepository } from './sub-recipe.repository';
import { convertUnit } from '../utils/convertUnit';

@Injectable()
export class SubRecipeService {
    constructor(
        @InjectRepository(SubRecipe)
        private subRecipeRepository: Repository<SubRecipe>,
        //do this for keep  data acces to a repository and not in the service 
        private mySubRecipeRepository: SubRecipeRepository,

        // inject recipe cost service to update  the recipe cost on subRecipe CRUD 
        @InjectRepository(Recipe)
        private readonly recipeRepository: Repository<Recipe>,
        private readonly recipeCostService: RecipeCostService,

    ){}

    async findAll(): Promise<SubRecipeDto[]> {
        return this.subRecipeRepository.find()
    }

    async findOne(subRecipeId: string): Promise<SubRecipeDto>{
        return this.subRecipeRepository.findOne({where: {id: subRecipeId}})
    }

    async getAllByParentRecipe(recipeId: string):Promise<SubRecipe[]>{
        return this.mySubRecipeRepository.getAllByParentRecipe(recipeId)
    }

    async create(subRecipe: SubRecipeDto): Promise<SubRecipe>{
        const cost = await this.calculateCost(subRecipe)
        subRecipe.cost = cost
        return await this.mySubRecipeRepository.createSubRecipe(subRecipe)

        // update the parent recipe Cost 
        // const newRecipeCost = await this.recipeCostService.calculateRecipeCost(subRecipe.parentRecipe.id)
        // await this.recipeRepository.update(subRecipe.parentRecipe.id,{cost: newRecipeCost})
        // return newSubRecipe
    }


    async update(subRecipeId: string, subRecipeData: Partial<SubRecipeDto>): Promise<SubRecipe>{
        await this.subRecipeRepository.update(subRecipeId, subRecipeData)
        let subRecipeUpdated = await this.subRecipeRepository.findOne({where: {id: subRecipeId}})
        
        // update sub Recipe cost 
        subRecipeUpdated.cost = await this.calculateCost(subRecipeUpdated)
        subRecipeUpdated = await this.subRecipeRepository.save(subRecipeUpdated)
        
        //update parent recipe Cost 
        const newRecipeCost = await this.recipeCostService.calculateRecipeCost(subRecipeUpdated.parentRecipe.id)
        await this.recipeRepository.update(subRecipeUpdated.parentRecipe.id,{cost: newRecipeCost})
        
        return this.subRecipeRepository.findOne({where: {id: subRecipeId}})

    }

    async delete(subRecipeId: string): Promise<void>{
        const subRecipe = await this.subRecipeRepository.findOne({where:{id:subRecipeId}, relations:['parentRecipe']})
        
        // delete the subRecipe
        await this.subRecipeRepository.delete(subRecipe)

        const newRecipeCost = await this.recipeCostService.calculateRecipeCost(subRecipe.parentRecipe.id)
        await this.recipeRepository.update(subRecipe.parentRecipe.id, {cost:newRecipeCost});
    }

    async deleteAllByRecipe(reicpeId: string): Promise<void>{
        await this.subRecipeRepository.delete({parentRecipe: {id: reicpeId}})
    }

    async calculateCost(subRecipe: SubRecipeDto){
        const {cost, unitType, quantity} = subRecipe.parentRecipe
        const {quantityNeeded, unit} = subRecipe
        
        let totalCost = 0;

        const convertedQuantity = convertUnit(quantityNeeded,unit,unitType);

        totalCost = convertedQuantity * cost / quantity
        return parseFloat(totalCost.toFixed(2))
    }
}

