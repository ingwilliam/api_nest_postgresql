import { BaseEntity } from "../../common/entities/base.entity";
import { Usuario } from "../../usuarios/entities";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('repositorios')
export class Repositorio extends BaseEntity{


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    filename: string;

    @Column('text')
    repositorio: string;

    @Column('text')
    tipo: string;

    @Column('text')
    url: string;
    
    
    @ManyToOne(
        () => Usuario,
        (usuario) => usuario.repositorios,
        { onDelete: "CASCADE", nullable: false }
    )
    usuario: Usuario

    @BeforeInsert()
    checkFieldsBeforeInsert() {

    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {

    }

}
