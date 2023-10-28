import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';
import { Route } from '@prisma/client';

export class RoutesSerializer implements Omit<Route, 'directions'> {
  id: number;
  name: string;
  sourceId: number;
  destinationId: number;
  duration: number;
  distance: number;
  directions: DirectionsResponseData & { request: any };
  created_at: Date;
  updated_at: Date;

  constructor(route: Route) {
    this.id = route.id;
    this.name = route.name;
    this.sourceId = route.sourceId;
    this.destinationId = route.destinationId;
    this.duration = route.duration;
    this.distance = route.distance;
    this.directions = JSON.parse(route.directions as any);
    this.created_at = route.created_at;
    this.updated_at = route.updated_at;
  }
}
