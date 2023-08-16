import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from "src/products/entities";
import { UsuarioRol} from "./usuariorol.entity";

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

    @OneToMany(
        ()=>Product,
        (product)=>product.user,        
    )
    products: Product[]

    @OneToMany(
        ()=>UsuarioRol,
        (usuarioRol)=>usuarioRol.usuario, 
        {cascade:true,eager:true}       
    )
    usuarioRoles?: UsuarioRol[]

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.email = this.email.toLocaleLowerCase().trim();
    }
}
