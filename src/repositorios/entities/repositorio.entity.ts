import { Usuario } from "../../usuarios/entities";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('repositorios')
export class Repositorio {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    nombre: string;

    @Column('text')
    repositorio: string;

    @Column('text')
    url: string;

    @Column('boolean', {
        default: true
    })
    activo: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

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
