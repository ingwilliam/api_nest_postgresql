import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
  
  export abstract class BaseEntity {

    @Column('boolean', {
        default: false
    })
    activo: boolean;
    
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;   
        
  }  