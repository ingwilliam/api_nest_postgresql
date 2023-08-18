import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioRol} from "./usuariorol.entity";
import { Repositorio } from '../../repositorios/entities/repositorio.entity';
import { IsIn } from 'class-validator';


@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true,
    })
    email:string;

    @Column('text',{
        select:false
    })
    password:string;

    @Column({ name: 'nombre_completo', type: 'varchar' })
    nombreCompleto:string;

    @Column('boolean',{
        default:true
    })
    activo:boolean;

    @Column('text',{
        default:'BASICA'
    })
    autenticacion: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(
        ()=>UsuarioRol,
        (usuarioRol)=>usuarioRol.usuario, 
        {cascade:true}       
    )
    usuarioRoles: UsuarioRol[]

    @OneToMany(
        ()=>Repositorio,
        (repositorio)=>repositorio.usuario, 
        {cascade:true}       
    )
    repositorios: Repositorio[]

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
}