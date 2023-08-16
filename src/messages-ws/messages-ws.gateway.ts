import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({cors:true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{
  
  @WebSocketServer() wss:Server

  constructor(
      private readonly messagesWsService: MessagesWsService,
      private readonly jwtService:JwtService
  ) {
    
  }
  async handleConnection(client: Socket) {

    const token = client.handshake.headers.authenticacion as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);  
      await this.messagesWsService.registerClient(client,payload.id);    
      
    } catch (error) {
      client.disconnect()
      return;
    }

    //console.log({payload});
    
    
    this.wss.emit('clientes-nuevos',this.messagesWsService.getConnectedClients());


  }

  handleDisconnect(client: Socket) {

    this.messagesWsService.removeClient(client.id);    
    this.wss.emit('clientes-nuevos',this.messagesWsService.getConnectedClients());    

  }

  @SubscribeMessage('enviar-mensaje-todos')
  onEnviarMensajeTodos( client:Socket, payload:NewMessageDto){


    //emite solo al cliente inicial
    // client.emit('escuchar-mensaje-todos',{
    //   nombreCompleto:'Soy Yo',
    //   message:payload.message||'no mensajes'
    // })

    //emite a todos menos al cliente inicial
    // client.broadcast.emit('escuchar-mensaje-todos',{
    //   nombreCompleto:'Soy Yo',
    //   message:payload.message||'no mensajes'
    // })

    //emite todos
    this.wss.emit('escuchar-mensaje-todos',{
      nombreCompleto:this.messagesWsService.getUsernombreCompleto(client.id),
      message:payload.message||'no mensajes'
    })
    

  }


}
