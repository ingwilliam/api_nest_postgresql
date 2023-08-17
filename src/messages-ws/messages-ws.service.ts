import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Usuario } from 'src/usuarios/entities';
import { Repository } from 'typeorm';

interface ConnectedClients{
    [id:string]:{
        socket:Socket,
        user:Usuario,
    }
}

@Injectable()
export class MessagesWsService {

    private connectedClients:ConnectedClients = {}

    constructor(
        @InjectRepository(Usuario)
        private readonly userRepository: Repository<Usuario>
    ){}

    async registerClient(client:Socket,userId:string){
        const user = await this.userRepository.findOneBy({id:userId});
        if(!user){
            throw new Error ('El usuario no existe');
        }
        if(!user.activo){
            throw new Error ('El usuario no esta activo');
        }
        this.ckeckUserConnection(user);
        this.connectedClients[client.id] = {
            socket:client,
            user
        };
    };


    removeClient(clientId:string){
        delete this.connectedClients[clientId];
    };

    getConnectedClients():string[]{
        //console.log(this.connectedClients);
        
        return Object.keys(this.connectedClients);
    }

    getUsernombreCompleto(socketId:string){
        return this.connectedClients[socketId].user.nombreCompleto;    
    }

    private ckeckUserConnection(user:Usuario){
        for(const clientId of Object.keys(this.connectedClients)){
            const connectClient = this.connectedClients[clientId];
            if(connectClient.user.id==user.id){
                connectClient.socket.disconnect();
                break;
            }
        }

    }


}
