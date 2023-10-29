"use client";

import { useMap } from "@/hooks/useMap";
import type {
    DirectionsResponseData,
    FindPlaceFromTextResponseData,
} from "@googlemaps/google-maps-services-js";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

export function NewRoute() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useMap(mapContainerRef);
    const [directionsResponseData, setDirectionsResponseData] = useState<
        DirectionsResponseData & {
            request: any;
        }
    >();
    const [routeOptions, setRouteOptions] = useState([]);
    const [sourceValue, setSourceValue] = useState("");
    const [destinationValue, setDestinationValue] = useState("");

    const handleSourceValue = (e: any) => {
        setSourceValue(e.target.value);
    };

    const handleDestinationValue = (e: any) => {
        setDestinationValue(e.target.value);
    };

    useEffect(() => {
        fetch("http://localhost:3000/routes")
            .then((res) => res.json())
            .then((data) => {
                setRouteOptions(data);
            });
    }, []);

    async function searchPlacesEvent(event: FormEvent) {
        event.preventDefault();

        searchPlaces(sourceValue, destinationValue);
    }

    async function searchPlaces(source: string, destination: string) {
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

        await searchDirections(
            sourcePlace.candidates[0].place_id as string,
            destinationPlace.candidates[0].place_id as string
        );
    }

    async function searchDirections(
        sourcePlace: string,
        destinationPlace: string
    ) {
        const queryParams = new URLSearchParams({
            originId: sourcePlace,
            destinationId: destinationPlace,
        });

        const directionsResponse = await fetch(
            `http://localhost:3000/directions?${queryParams.toString()}`
        );

        const directionsResponseData: DirectionsResponseData & {
            request: any;
        } = await directionsResponse.json();
        setDirectionsResponseData(directionsResponseData);
        setMap(directionsResponseData);
    }

    function setMap(
        directionsResponseData: DirectionsResponseData & {
            request: any;
        }
    ) {
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

        fetch("http://localhost:3000/routes")
            .then((res) => res.json())
            .then((data) => {
                setRouteOptions(data);
            });

        for (const step of steps.steps) {
            await sleep(2000);
            moveCar(step.start_location);

            await sleep(2000);
            moveCar(step.end_location);
        }
    }

    function moveCar(point: google.maps.LatLngLiteral) {
        map?.moveCar("1", {
            lat: point.lat,
            lng: point.lng,
        });
    }

    function searchRoute(event: FormEvent) {
        event.preventDefault();

        const routeId = document.querySelector<HTMLInputElement>(
            "select[name=route_select]"
        )?.value;

        if (routeId === "0") {
            map?.removeAllRoutes();
            setDirectionsResponseData(undefined);
            return;
        }

        fetch(`http://localhost:3000/routes/${routeId}`)
            .then((res) => res.json())
            .then((data) => {
                const legs = data.directions.routes[0].legs[0];
                const source = legs.start_address.split(" -")[0];
                const destination = legs.end_address.split(",")[0];
                setSourceValue(source);
                setDestinationValue(destination);
                searchPlaces(source, destination);
            });
    }

    return (
        <div className="flex flex-row h-full">
            <div className="flex flex-col w-[500px] p-4 shadow-lg overflow-hidden">
                <Link
                    href="/"
                    className="text-yellow-500 text-5xl font-bold my-12 mx-auto"
                >
                    GeoMap
                </Link>
                <h2 className="text-yellow-500 text-2xl font-bold">
                    Nova Rota
                </h2>
                <form
                    className="flex flex-col gap-4 my-4"
                    onSubmit={searchPlacesEvent}
                >
                    <input
                        name="source_place"
                        placeholder="Origem"
                        className="h-12 px-4 bg-gray-200"
                        value={sourceValue}
                        onChange={handleSourceValue}
                    />
                    <input
                        name="destination_place"
                        placeholder="Destino"
                        className="h-12 px-4 bg-gray-200"
                        value={destinationValue}
                        onChange={handleDestinationValue}
                    />
                    <button
                        type="submit"
                        className="bg-yellow-500 text-gray-600 font-bold h-12 rounded"
                    >
                        Pesquisar
                    </button>
                </form>
                <select
                    name="route_select"
                    className="h-12 rounded border-none bg-gray-200"
                    onChange={searchRoute}
                >
                    <option value={0}>Selecionar Rota</option>
                    {routeOptions.map((route: any) => {
                        return (
                            <option key={route.id} value={route.id}>
                                {route.name}
                            </option>
                        );
                    })}
                </select>
                <div className="flex flex-col text-gray-100 my-12 min-h-[350px]">
                    {directionsResponseData && (
                        <>
                            <div className="flex h-12 justify-between">
                                <h4 className="font-bold">Origem:</h4>
                                <p>
                                    {
                                        directionsResponseData?.routes[0]!
                                            .legs[0]!.start_address
                                    }
                                </p>
                            </div>
                            <div className="flex h-12 justify-between">
                                <h4 className="font-bold">Destino:</h4>
                                <p>
                                    {
                                        directionsResponseData?.routes[0]!
                                            .legs[0]!.end_address
                                    }
                                </p>
                            </div>
                            <div className="flex h-12 justify-between">
                                <h4 className="font-bold">Distância:</h4>
                                <p>
                                    {
                                        directionsResponseData?.routes[0]!
                                            .legs[0]!.distance.text
                                    }
                                </p>
                            </div>
                            <div className="flex h-12 justify-between">
                                <h4 className="font-bold">Duração:</h4>
                                <p>
                                    {
                                        directionsResponseData?.routes[0]!
                                            .legs[0]!.duration.text
                                    }
                                </p>
                            </div>
                            <button
                                className="bg-blue-500 h-12 font-bold text-white rounded"
                                onClick={createRoute}
                            >
                                Adicionar rota
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div id="map" className="h-full w-full" ref={mapContainerRef}></div>
        </div>
    );
}

export default NewRoute;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
