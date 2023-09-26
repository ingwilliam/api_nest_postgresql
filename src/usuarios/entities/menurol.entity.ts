import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Menu } from "./menu.entity";
import { Rol } from "./rol.entity";
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('menus_roles')
export class MenuRol extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(
        ()=>Menu,
        (menu) => menu.menuRoles,
        {onDelete: 'CASCADE'}
    )
    menu:Menu

    @ManyToOne(
        ()=>Rol,
        (rol) => rol.rolMenus,
        {onDelete: 'CASCADE'}
    )
    rol:Rol

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
