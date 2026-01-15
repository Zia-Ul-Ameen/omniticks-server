import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  metaTitle: string;

  @Column()
  metaDescription: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column({ nullable: true, type: 'text' })
  features: string;

  @Column('decimal', { precision: 10, scale: 2 })
  originalPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  offerPrice: number;

  @Column()
  brandName: string;

  @Column({ default: false })
  warranty: boolean;

  @Column({ default: false })
  withOgBox: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ogBoxPrice: number;

  @Column('text', { array: true })
  images: string[];

  @Column({ nullable: true })
  video: string;

  @Column({ default: 0 })
  stock: number;

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({ name: 'product_tags' })
  tags: Tag[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'product_categories' })
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
