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
    usuario:Usuario

    @ManyToOne(
        ()=>Rol,
        (rol) => rol.rolUsuarios,
        {onDelete:"CASCADE"}
    )
    rol:Rol

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
