import { Tag } from '../../tags/entities/tag.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class Product {
    id: string;
    metaTitle: string;
    metaDescription: string;
    title: string;
    slug: string;
    description: string;
    features: string;
    originalPrice: number;
    offerPrice: number;
    brandName: string;
    warranty: boolean;
    withOgBox: boolean;
    ogBoxPrice: number;
    images: string[];
    video: string;
    stock: number;
    tags: Tag[];
    categories: Category[];
    createdAt: Date;
    updatedAt: Date;
}
