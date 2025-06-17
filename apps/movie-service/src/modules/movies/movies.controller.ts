import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { CoreMoviesService } from "./services/core";
import { PaginateDto } from "src/common";

@Controller({
    version: '1',
    path: 'movies'
})
export class MoviesController{
    constructor(
        private readonly service: CoreMoviesService
    ){}

    @Get()
    async findAll(@Query() options: PaginateDto){}

    @Get(':slub')
    async find(@Param('slug', new ParseUUIDPipe({version: '4'})) slug: string){}
}