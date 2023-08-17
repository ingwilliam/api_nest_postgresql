import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UsuarioRol} from "./usuariorol.entity";

@Entity('roles')
export class Rol{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', {
        unique: true,
    })
    rol:string;

    @Column('boolean',{
        default:true
    })
    activo:boolean;

    @OneToMany(
        ()=>UsuarioRol,
        (usuarioRol)=>usuarioRol.rol,        
        {cascade:true}       
    )
    rolUsuarios: UsuarioRol[]

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        
    }
}
