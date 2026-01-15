import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsArray, IsUUID, Matches, Min, ArrayMinSize } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  metaTitle: string;

  @IsString()
  @IsNotEmpty()
  metaDescription: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be kebab-case',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  features?: string;

  @IsNumber()
  @Min(0)
  originalPrice: number;

  @IsNumber()
  @Min(0)
  offerPrice: number;

  @IsString()
  @IsNotEmpty()
  brandName: string;

  @IsBoolean()
  @IsOptional()
  warranty?: boolean;

  @IsBoolean()
  @IsOptional()
  withOgBox?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  ogBoxPrice?: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @IsString()
  @IsOptional()
  video?: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  tagIds: string[];

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMinSize(1)
  categoryIds: string[];
}
