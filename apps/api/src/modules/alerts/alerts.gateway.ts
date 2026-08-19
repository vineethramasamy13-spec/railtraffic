import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/alerts',
  cors: { origin: '*' },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected to alerts namespace: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from alerts namespace: ${client.id}`);
  }

  broadcastNewAlert(alert: any) {
    this.server.emit('new-alert', alert);
  }

  broadcastAlertUpdate(alert: any) {
    this.server.emit('alert-update', alert);
  }

  broadcastAlertResolved(alert: any) {
    this.server.emit('alert-resolved', alert);
  }
}
