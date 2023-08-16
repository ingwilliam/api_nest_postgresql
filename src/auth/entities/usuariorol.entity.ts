import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from "./usuario.entity";
import { Rol } from "./rol.entity";

@Entity('usuarios_roles')
export class UsuarioRol {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(
        ()=>Usuario,
        (usuario) => usuario.usuarioRoles,
        {onDelete:"CASCADE"}
    )
    @JoinColumn({ name: 'usuarioId' })
    usuario:Usuario

    @ManyToOne(
        ()=>Rol,
        (rol) => rol.rolUsuarios,
        {onDelete:"CASCADE"}
    )
    @JoinColumn({ name: 'rolId' })
    rol:Rol

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
