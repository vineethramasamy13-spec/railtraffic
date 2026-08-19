import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('stations')
@Controller('stations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all stations' })
  findAll() {
    return this.stationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get station by ID' })
  findOne(@Param('id') id: string) {
    return this.stationsService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get station by code' })
  findByCode(@Param('code') code: string) {
    return this.stationsService.findByCode(code);
  }
}
