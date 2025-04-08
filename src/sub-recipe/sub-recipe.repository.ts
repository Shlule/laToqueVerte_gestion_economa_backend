import { Inject, Injectable, Scope} from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SubRecipe } from "./sub-recipe.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { SubRecipeDto } from "./sub-recipe.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";

//TODO - try to create to repository in one file ,
//one  request scoped et other one just with personnal complexe operation 

// @Injectable()
// export class SubRecipeRepository extends Repository<SubRecipe>{
//     constructor(@InjectRepository(SubRecipe) respository: Repository<SubRecipe>){
//         super(respository.target, respository.manager , respository.queryRunner);
        
//     }


//     async getAllByParentRecipe(parentRecipeId: string): Promise<SubRecipe[]>{
//         return this.manager.getRepository(SubRecipe)
//         .createQueryBuilder('subRecipe')
//         .leftJoinAndSelect('subRecipe.parentRecipe', 'parentRecipe')
//         .where('parentRecipe.id = :parentRecipeId', {parentRecipeId})
//         .getMany()
//     }

// }


@Injectable({scope: Scope.REQUEST})
export class SubRecipeRepository  extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request){
        super(dataSource, req)
    }

    async createSubRecipe(subRecipe: SubRecipeDto){
        const newSubRecipe = await this.getRepository(SubRecipe).create(subRecipe)
        return await this.getRepository(SubRecipe).save(newSubRecipe)
    }

    async getAllByParentRecipe(parentRecipeId: string): Promise<SubRecipe[]>{
        return this.getRepository(SubRecipe)
        .createQueryBuilder('subRecipe')
        .leftJoinAndSelect('subRecipe.parentRecipe', 'parentRecipe')
        .where('parentRecipe.id = :parentRecipeId', {parentRecipeId})
        .getMany()
    }

}





