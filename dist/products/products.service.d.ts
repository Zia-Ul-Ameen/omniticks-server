import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Tag } from '../tags/entities/tag.entity';
import { Category } from '../categories/entities/category.entity';
export declare class ProductsService {
    private readonly productRepository;
    private readonly tagRepository;
    private readonly categoryRepository;
    constructor(productRepository: Repository<Product>, tagRepository: Repository<Tag>, categoryRepository: Repository<Category>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(query: any): Promise<{
        data: Product[];
        pagination: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    updateStock(id: string, stock: number): Promise<Product>;
}
