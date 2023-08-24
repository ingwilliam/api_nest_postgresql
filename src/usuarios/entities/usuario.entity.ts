import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioRol} from "./usuariorol.entity";
import { Repositorio } from '../../repositorios/entities/repositorio.entity';
import { IsIn } from 'class-validator';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';


@Entity('usuarios')
export class Usuario extends BaseEntity{

    @ApiProperty({
        example:'19583ac9-c926-4881-ba8a-3cb30f88aa65',
        description:'id',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'example@exampĺe.com',
        description:'El correo del usuario con el cual se registra y se autentica',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    email:string;

    @ApiProperty({
        description:'El password del usuario con el cual se registra y se autentica',        
    })
    @Column('text',{
        select:false
    })
    password:string;

    @ApiProperty({
        description:'El nombre completo del usuario',        
    })
    @Column({ name: 'nombre_completo', type: 'varchar' })
    nombreCompleto:string;

    @ApiProperty({
        example:['BASICA','GOOGLE','FACEBOOK'],
        description:'Por que medio se autentico (Goggle,Facebook,Basica)',        
    })
    @Column('text',{
        default:'BASICA'
    })
    autenticacion: string;

    @ApiProperty({
        description:'Los roles asignados al usuario',        
    })
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