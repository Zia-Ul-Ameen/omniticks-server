import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Tag } from '../tags/entities/tag.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { tagIds, categoryIds, ...productData } = createProductDto;

    const existingSlug = await this.productRepository.findOne({ where: { slug: productData.slug } });
    if (existingSlug) {
      throw new ConflictException('Product with this slug already exists');
    }

    const tags = await this.tagRepository.findBy({ id: In(tagIds) });
    const categories = await this.categoryRepository.findBy({ id: In(categoryIds) });

    const product = this.productRepository.create({
      ...productData,
      tags,
      categories,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: any) {
    const {
      page = 1,
      perPage = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      category,
      brand,
    } = query;

    const skip = (page - 1) * perPage;
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.tags', 'tags')
      .leftJoinAndSelect('product.categories', 'categories');

    if (search) {
      queryBuilder.andWhere(
        '(product.title ILIKE :search OR product.slug ILIKE :search OR product.brandName ILIKE :search)',
        { search: `%${search}%` },
      );
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['tags', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const { tagIds, categoryIds, ...productData } = updateProductDto;
    const product = await this.findOne(id);

    if (tagIds) {
      product.tags = await this.tagRepository.findBy({ id: In(tagIds) });
    }
    if (categoryIds) {
      product.categories = await this.categoryRepository.findBy({ id: In(categoryIds) });
    }

    Object.assign(product, productData);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async updateStock(id: string, stock: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock = stock;
    return this.productRepository.save(product);
  }
}
