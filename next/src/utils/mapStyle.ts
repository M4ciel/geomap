function createColorStyle(color: string) {
    return [{ color }];
}

function createFillStyle(color: string) {
    return [{ color }];
}

function createStrokeStyle(color: string) {
    return [{ color }];
}

export const mapStyle: MapStyle.Data[] = [
    { elementType: "geometry", stylers: createColorStyle("#242f3e") },
    {
        elementType: "labels.text.stroke",
        stylers: createStrokeStyle("#242f3e"),
    },
    {
        elementType: "labels.text.fill",
        stylers: createFillStyle("#746855"),
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#d59563"),
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#d59563"),
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: createColorStyle("#263c3f"),
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#6b9a76"),
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: createColorStyle("#38414e"),
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: createStrokeStyle("#212a37"),
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#9ca5b3"),
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: createColorStyle("#746855"),
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: createStrokeStyle("#1f2835"),
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#f3d19c"),
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: createColorStyle("#2f3948"),
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#d59563"),
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: createColorStyle("#17263c"),
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: createFillStyle("#515c6d"),
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: createStrokeStyle("#17263c"),
    },
];
