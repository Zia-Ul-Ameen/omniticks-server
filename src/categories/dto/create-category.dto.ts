import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be kebab-case (e.g., my-category-name)',
  })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;
}
