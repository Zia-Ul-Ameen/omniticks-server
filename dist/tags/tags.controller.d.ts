import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    create(createTagDto: CreateTagDto): Promise<import("./entities/tag.entity").Tag>;
    findAll(page?: number, perPage?: number, search?: string): Promise<{
        data: import("./entities/tag.entity").Tag[];
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/tag.entity").Tag>;
    update(id: string, updateTagDto: UpdateTagDto): Promise<import("./entities/tag.entity").Tag>;
    remove(id: string): Promise<void>;
}
