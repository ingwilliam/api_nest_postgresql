import { Usuario } from "../../usuarios/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('repositorios')
export class Repositorio {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    nombre:string;

    @Column('text')
    repositorio:string;

    @Column('text')
    url:string;

    @Column('boolean',{
        default:true
    })
    activo:boolean;

    @ManyToOne(
        ()=>Usuario,
        (usuario) => usuario.repositorios,
        {onDelete:"CASCADE",nullable: false}
    )
    usuario:Usuario
    
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }

}
