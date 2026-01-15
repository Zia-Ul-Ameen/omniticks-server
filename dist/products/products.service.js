"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const tag_entity_1 = require("../tags/entities/tag.entity");
const category_entity_1 = require("../categories/entities/category.entity");
let ProductsService = class ProductsService {
    productRepository;
    tagRepository;
    categoryRepository;
    constructor(productRepository, tagRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.tagRepository = tagRepository;
        this.categoryRepository = categoryRepository;
    }
    async create(createProductDto) {
        const { tagIds, categoryIds, ...productData } = createProductDto;
        const existingSlug = await this.productRepository.findOne({ where: { slug: productData.slug } });
        if (existingSlug) {
            throw new common_1.ConflictException('Product with this slug already exists');
        }
        const tags = await this.tagRepository.findBy({ id: (0, typeorm_2.In)(tagIds) });
        const categories = await this.categoryRepository.findBy({ id: (0, typeorm_2.In)(categoryIds) });
        const product = this.productRepository.create({
            ...productData,
            tags,
            categories,
        });
        return this.productRepository.save(product);
    }
    async findAll(query) {
        const { page = 1, perPage = 10, search, sortBy = 'createdAt', sortOrder = 'DESC', category, brand, } = query;
        const skip = (page - 1) * perPage;
        const queryBuilder = this.productRepository.createQueryBuilder('product')
            .leftJoinAndSelect('product.tags', 'tags')
            .leftJoinAndSelect('product.categories', 'categories');
        if (search) {
            queryBuilder.andWhere('(product.title ILIKE :search OR product.slug ILIKE :search OR product.brandName ILIKE :search)', { search: `%${search}%` });
        }
        if (category) {
            queryBuilder.andWhere('categories.id = :categoryId', { categoryId: category });
        }
        if (brand) {
            queryBuilder.andWhere('product.brandName = :brand', { brand });
        }
        queryBuilder.orderBy(`product.${sortBy}`, sortOrder.toUpperCase());
        queryBuilder.skip(skip).take(perPage);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            data,
            pagination: {
                page: +page,
                perPage: +perPage,
                total,
                totalPages: Math.ceil(total / perPage),
            },
        };
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['tags', 'categories'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        const { tagIds, categoryIds, ...productData } = updateProductDto;
        const product = await this.findOne(id);
        if (tagIds) {
            product.tags = await this.tagRepository.findBy({ id: (0, typeorm_2.In)(tagIds) });
        }
        if (categoryIds) {
            product.categories = await this.categoryRepository.findBy({ id: (0, typeorm_2.In)(categoryIds) });
        }
        Object.assign(product, productData);
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
    async updateStock(id, stock) {
        const product = await this.findOne(id);
        product.stock = stock;
        return this.productRepository.save(product);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map