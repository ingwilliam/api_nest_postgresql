import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('repositorios')
export class Repositorio {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true,
    })
    nombre:string;

    @Column('text', {
        unique: true,
    })
    repositorio:string;

    @Column('text')
    url:string;

    @Column('boolean',{
        default:true
    })
    activo:boolean;

    
    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }

}
