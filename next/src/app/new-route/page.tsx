"use client";

import { useMap } from "@/hooks/useMap";
import type {
    DirectionsResponseData,
    FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import { FormEvent, useRef, useState } from "react";

export function NewRoutePage() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useMap(mapContainerRef);
    const [directionsResponseData, setDirectionsResponseData] = useState<
        DirectionsResponseData & {
            request: any;
        }
    >();

    async function searchPlaces(event: FormEvent) {
        event.preventDefault();

        const source = document.querySelector<HTMLInputElement>(
            "input[name=source_place]"
        )?.value;

        const destination = document.querySelector<HTMLInputElement>(
            "input[name=destination_place]"
        )?.value;

        const [sourceResponse, destinationResponse] = await Promise.all([
            fetch(`http://localhost:3000/places?text=${source}`),
            fetch(`http://localhost:3000/places?text=${destination}`),
        ]);

        const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] =
            await Promise.all([
                sourceResponse.json(),
                destinationResponse.json(),
            ]);

        if (sourcePlace.status !== "OK") {
            console.error(sourcePlace);
            alert("Não foi possível encontrar o local de origem");
            return;
        }

        if (destinationPlace.status !== "OK") {
            console.error(destinationPlace);
            alert("Não foi possível encontrar o local de destino");
            return;
        }

        const queryParams = new URLSearchParams({
            originId: sourcePlace.candidates[0].place_id as string,
            destinationId: destinationPlace.candidates[0].place_id as string,
        });

        const directionsResponse = await fetch(
            `http://localhost:3000/directions?${queryParams.toString()}`
        );

        const directionsResponseData: DirectionsResponseData & {
            request: any;
        } = await directionsResponse.json();
        setDirectionsResponseData(directionsResponseData);

        map?.removeAllRoutes();

        map?.addRouteWithIcons({
            routeId: "1",
            startMarkerOptions: {
                position:
                    directionsResponseData.routes[0]!.legs[0]!.start_location,
            },
            endMarkerOptions: {
                position:
                    directionsResponseData.routes[0]!.legs[0]!.end_location,
            },
            carMarkerOptions: {
                position:
                    directionsResponseData.routes[0]!.legs[0]!.start_location,
            },
            directionsResponseData,
        });
    }

    async function createRoute() {
        const response = await fetch("http://localhost:3000/routes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: `${
                    directionsResponseData?.routes[0]!.legs[0]!.start_address
                } - ${directionsResponseData?.routes[0]!.legs[0]!.end_address}`,
                source_id: directionsResponseData?.request.origin.place_id,
                destination_id:
                    directionsResponseData?.request.destination.place_id,
            }),
        });

        const route = await response.json();

        const { legs } = route.directions.routes[0];

        const steps = legs[0];

        for (const step of steps.steps) {
            await sleep(2000);
            moveCar(step.start_location);
            //socket

            await sleep(2000);
            moveCar(step.end_location);
            //socket
        }
    }

    function moveCar(point: google.maps.LatLngLiteral) {
        map?.moveCar("1", {
            lat: point.lat,
            lng: point.lng,
        });
    }

    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-[500px] p-4 shadow-lg overflow-hidden">
                <h1 className="text-yellow-500 text-5xl font-bold my-12 mx-auto">
                    GEOMap
                </h1>
                <h2 className="text-yellow-500 text-2xl font-bold">
                    Nova Rota
                </h2>
                <form
                    className="flex flex-col gap-4 my-4"
                    onSubmit={searchPlaces}
                >
                    <input
                        name="source_place"
                        placeholder="Origem"
                        className="h-12 px-4"
                    />
                    <input
                        name="destination_place"
                        placeholder="Destino"
                        className="h-12 px-4"
                    />
                    <button
                        type="submit"
                        className="bg-yellow-500 text-gray-600 font-bold h-12 rounded"
                    >
                        Pesquisar
                    </button>
                </form>
                {directionsResponseData && (
                    <div className="flex flex-col text-gray-100 my-12">
                        <div className="flex h-12 justify-between">
                            <h4 className="font-bold">Origem:</h4>
                            <p>
                                {
                                    directionsResponseData?.routes[0]!.legs[0]!
                                        .start_address
                                }
                            </p>
                        </div>
                        <div className="flex h-12 justify-between">
                            <h4 className="font-bold">Destino:</h4>
                            <p>
                                {
                                    directionsResponseData?.routes[0]!.legs[0]!
                                        .end_address
                                }
                            </p>
                        </div>
                        <div className="flex h-12 justify-between">
                            <h4 className="font-bold">Distância:</h4>
                            <p>
                                {
                                    directionsResponseData?.routes[0]!.legs[0]!
                                        .distance.text
                                }
                            </p>
                        </div>
                        <div className="flex h-12 justify-between">
                            <h4 className="font-bold">Duração:</h4>
                            <p>
                                {
                                    directionsResponseData?.routes[0]!.legs[0]!
                                        .duration.text
                                }
                            </p>
                        </div>
                        <button
                            className="bg-blue-500 h-12 font-bold text-white rounded"
                            onClick={createRoute}
                        >
                            Adicionar rota
                        </button>
                    </div>
                )}
            </div>
            <div id="map" className="h-full w-full" ref={mapContainerRef}></div>
        </div>
    );
}

export default NewRoutePage;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
