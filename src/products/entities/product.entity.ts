import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image-entity";
import { Usuario } from "src/auth/entities/usuario.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example:'19583ac9-c926-4881-ba8a-3cb30f88aa65',
        description:'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'T-Shit Teslo',
        description:'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example:0,
        description:'Product Price'
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example:'Eiusmod excepteur esse deserunt fugiat quis officia veniam eu id adipisicing ad.',
        description:'Product Description',
        default: null
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example:'t_shit_teslo',
        description:'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example:10,
        description:'Product stock',
        default:0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example:['M','L','XL'],
        description:'Product stock',
        default:0
    })
    @Column('text',{
        array: true
    })
    sizes: string[];

    @ApiProperty()
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        ()=>ProductImage,
        (productImage)=>productImage.product,
        {cascade:true, eager:true}
    )
    images?: ProductImage[]

    @ApiProperty()
    @ManyToOne(
        ()=>Usuario,
        (user) => user.products,
        {eager:true}
    )
    user:Usuario


    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

}
