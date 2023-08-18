import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from "./usuario.entity";
import { Rol } from "./rol.entity";

@Entity('usuarios_roles')
export class UsuarioRol {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(
        ()=>Usuario,
        (usuario) => usuario.usuarioRoles,
        {onDelete: 'CASCADE',nullable: false}
    )
    usuario:Usuario

    @ManyToOne(
        ()=>Rol,
        (rol) => rol.rolUsuarios,
        {onDelete: 'CASCADE',nullable: false}
    )
    rol:Rol

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
