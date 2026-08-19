import { Module } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { TrainsGateway } from './trains.gateway';

@Module({
  controllers: [TrainsController],
  providers: [TrainsService, TrainsGateway],
  exports: [TrainsService],
})
export class TrainsModule {}
