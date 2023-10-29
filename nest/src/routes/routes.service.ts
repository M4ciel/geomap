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

    const sourceLocation = await this.createIfNotExistsCoord(
      legs.start_location.lat,
      legs.start_location.lng,
    );

    const destinationLocation = await await this.createIfNotExistsCoord(
      legs.end_location.lat,
      legs.end_location.lng,
    );

    const source = await this.createIfNotExistsPlace(
      legs.start_address,
      sourceLocation.id,
    );

    const destination = await this.createIfNotExistsPlace(
      legs.end_address,
      destinationLocation.id,
    );

    return await this.createIfNotExistsRoute(
      createRouteDto.name,
      source.id,
      destination.id,
      legs.distance.value,
      legs.duration.value,
      JSON.stringify({
        available_travel_modes,
        geocoded_waypoints,
        routes,
        request,
      }),
    );
  }

  async createIfNotExistsCoord(lat: number, lng: number) {
    const coord = await this.prismaService.coord.findFirst({
      where: {
        lat,
        lng,
      },
    });

    if (coord === null) {
      return await this.prismaService.coord.create({
        data: {
          lat,
          lng,
        },
      });
    }

    return coord;
  }

  async createIfNotExistsPlace(name: string, locationId: number) {
    const place = await this.prismaService.place.findFirst({
      where: {
        name,
        locationId,
      },
    });

    if (place === null) {
      return await this.prismaService.place.create({
        data: {
          name,
          locationId,
        },
      });
    }

    return place;
  }

  async createIfNotExistsRoute(
    name: string,
    sourceId: number,
    destinationId: number,
    distance: number,
    duration: number,
    directions: string,
  ) {
    const route = await this.prismaService.route.findFirst({
      where: {
        sourceId,
        destinationId,
      },
    });

    if (route === null) {
      return await this.prismaService.route.create({
        data: {
          name,
          sourceId,
          destinationId,
          distance,
          duration,
          directions,
        },
      });
    }

    return route;
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
    return this.prismaService.route.findFirst({
      where: {
        id,
      },
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
}
