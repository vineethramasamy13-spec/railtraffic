import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrainsService } from './trains.service';
import { Interval } from '@nestjs/schedule';

@WebSocketGateway({
  namespace: '/trains',
  cors: { origin: '*' },
})
export class TrainsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly trainsService: TrainsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected to trains namespace: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToZone')
  handleSubscribeZone(client: Socket, zone: string) {
    client.join(`zone_${zone}`);
    return { event: 'subscribed', data: `Subscribed to zone ${zone}` };
  }

  @SubscribeMessage('subscribeToStation')
  handleSubscribeStation(client: Socket, stationCode: string) {
    client.join(`station_${stationCode}`);
    return { event: 'subscribed', data: `Subscribed to station ${stationCode}` };
  }

  @Interval(5000)
  async broadcastTrainPositions() {
    const trains = await this.trainsService.findAll();
    
    // Position updates from historical replay dataset
    const updates = trains.slice(0, 5).map(train => ({
      trainId: train.id,
      trainNumber: train.trainNumber,
      lat: Math.random() * 20 + 10,
      lon: Math.random() * 20 + 70,
      speed: Math.floor(Math.random() * 100),
      timestamp: new Date(),
    }));

    this.server.emit('position-update', updates);
  }

  @Interval(30000)
  async broadcastXAIUpdates() {
    const trains = await this.trainsService.findAll();
    if (trains.length === 0) return;
    
    const train = trains[Math.floor(Math.random() * trains.length)];
    
    this.server.emit('prediction-update', {
      trainId: train.id,
      delayPrediction: Math.floor(Math.random() * 60),
      xaiData: {
        confidence: 0.85,
        factors: ['Weather conditions', 'Track congestion']
      }
    });

    if (Math.random() > 0.7) {
      this.server.emit('maintenance-alert', {
        assetId: `TRK-00${Math.floor(Math.random() * 10)}`,
        riskScore: Math.floor(Math.random() * 100),
        recommendation: 'Inspect track alignment'
      });
    }

    if (Math.random() > 0.8) {
      this.server.emit('ai-recommendation', {
        type: 'ROUTING',
        message: 'Consider diverting freight traffic on UP line',
        priority: 'MEDIUM',
        actions: ['Analyze alternative routes']
      });
    }
  }
}
