export declare class CreateProductDto {
    metaTitle: string;
    metaDescription: string;
    title: string;
    slug: string;
    description: string;
    features?: string;
    originalPrice: number;
    offerPrice: number;
    brandName: string;
    warranty?: boolean;
    withOgBox?: boolean;
    ogBoxPrice?: number;
    images: string[];
    video?: string;
    stock: number;
    tagIds: string[];
    categoryIds: string[];
}
