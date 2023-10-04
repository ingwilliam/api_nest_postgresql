import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MenuRol} from "./menurol.entity";
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('menus')
export class Menu extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    tipo:string;

    @Column('text', {
        unique: true,
    })
    titulo:string;

    @Column('text')
    subTitulo:string;

    @Column('text')
    icono:string;

    @Column('text')
    link:string;

    @OneToMany(
        ()=>MenuRol,
        (menuRol)=>menuRol.menu,        
        {cascade:true}       
    )
    menuRoles: MenuRol[]

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
