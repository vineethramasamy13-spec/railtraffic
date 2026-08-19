import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TrainsService } from './trains.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('trains')
@Controller('trains')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all trains' })
  findAll() {
    return this.trainsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get train by ID' })
  findOne(@Param('id') id: string) {
    return this.trainsService.findOne(id);
  }

  @Get('number/:trainNumber')
  @ApiOperation({ summary: 'Get train by train number' })
  findByNumber(@Param('trainNumber') trainNumber: string) {
    return this.trainsService.findByNumber(trainNumber);
  }
}
