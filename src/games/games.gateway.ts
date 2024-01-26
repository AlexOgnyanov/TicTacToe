// import { Socket } from 'dgram';
// import { Server } from 'http';

// import {
//   UsePipes,
//   ValidationPipe,
//   UseGuards,
//   UseFilters,
//   UseInterceptors,
// } from '@nestjs/common';
// import * as dotenv from 'dotenv';

// import { UsersService } from '@/users/users.service';
// import { WebsocketExceptionsFilter } from '@/common/filters/gateway.filter';
// import { GatewayAcessTokenGuard } from '@/common/guards';
// import { SocketTransformInterceptor } from '@/common/interceptors';

// dotenv.config();

// @UsePipes(
//   new ValidationPipe({
//     whitelist: true,
//     transform: true,
//   }),
// )
// @UseGuards(GatewayAcessTokenGuard)
// @UseFilters(WebsocketExceptionsFilter)
// @UseInterceptors(SocketTransformInterceptor)
// @WebSocketGateway(Number(process.env.SOCKETIO_PORT), {
//   namespace: process.env.SOCKETIO_NAMESPACE,
//   cors: {
//     origin: '*',
//   },
// })
// export class GamesGateway implements OnGatewayConnection {
//   @WebSocketServer()
//   private readonly server: Server;
//   constructor(private usersService: UsersService) {}

//   async handleConnection(@ConnectedSocket() socket: Socket) {
//     try {
//       const token = socket.handshake.headers.authorization.split(' ')[1];
//     } catch (e) {
//       console.log(e);
//       socket.disconnect();
//     }
//   }

//   @SubscribeMessage(VybEvents.StartVyb)
//   async startVyb(@ConnectedSocket() socket: Socket): Promise<Room> {}
// }
