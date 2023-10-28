import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
// import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
  ) {}

  async create(createRouteDto: CreateRouteDto) {
    const { available_travel_modes, geocoded_waypoints, routes, request } =
      await this.directionsService.getDirections(
        createRouteDto.source_id,
        createRouteDto.destination_id,
      );

    const legs = routes[0].legs[0];

    const sourceLocation = await this.prismaService.coord.create({
      data: {
        lat: legs.start_location.lat,
        lng: legs.start_location.lng,
      },
    });

    const destinationLocation = await this.prismaService.coord.create({
      data: {
        lat: legs.end_location.lat,
        lng: legs.end_location.lng,
      },
    });

    const source = await this.prismaService.place.create({
      data: {
        name: legs.start_address,
        locationId: sourceLocation.id,
      },
    });

    const destination = await this.prismaService.place.create({
      data: {
        name: legs.end_address,
        locationId: destinationLocation.id,
      },
    });

    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        sourceId: source.id,
        destinationId: destination.id,
        distance: legs.distance.value,
        duration: legs.duration.value,
        directions: JSON.stringify({
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
        }),
      },
    });
  }

  findAll() {
    return this.prismaService.route.findMany({
      include: {
        source: {
          include: {
            location: true,
          },
        },
        destination: {
          include: {
            location: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  // update(id: number, updateRouteDto: UpdateRouteDto) {
  //   return `This action updates a #${id} route`;
  // }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
