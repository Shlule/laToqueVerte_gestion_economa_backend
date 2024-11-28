import { HttpException, HttpStatus } from "@nestjs/common";

export default class MyNotFoundError extends HttpException{
    constructor(ressource: string, identifier: string){
        super({
            title: 'Not Found',
            status: HttpStatus.NOT_FOUND,
            detail: 'The ressource you requested could not be found.',
            errors:[{
                message:`${ressource} with identifier ${identifier} was not found`
            }]
        }, HttpStatus.NOT_FOUND);
    }
}