import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UsuarioRol} from "./usuariorol.entity";
import { BaseEntity } from '../../common/entities/base.entity';
import { MenuRol } from './menurol.entity';

@Entity('roles')
export class Rol extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true,
    })
    rol:string;

    @OneToMany(
        ()=>UsuarioRol,
        (usuarioRol)=>usuarioRol.rol,        
        {cascade:true}       
    )
    rolUsuarios: UsuarioRol[]

    @OneToMany(
        ()=>MenuRol,
        (menuRol)=>menuRol.rol,        
        {cascade:true}       
    )
    rolMenus: MenuRol[]

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
