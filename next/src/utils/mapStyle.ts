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
    { elementType: ElementType.GEOMETRY, stylers: createColorStyle("#242f3e") },
    {
        elementType: ElementType.LABELS_TEXT_STROKE,
        stylers: createStrokeStyle("#242f3e"),
    },
    {
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#746855"),
    },
    {
        featureType: "administrative.locality",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#d59563"),
    },
    {
        featureType: "poi",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#d59563"),
    },
    {
        featureType: "poi.park",
        elementType: ElementType.GEOMETRY,
        stylers: createColorStyle("#263c3f"),
    },
    {
        featureType: "poi.park",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#6b9a76"),
    },
    {
        featureType: "road",
        elementType: ElementType.GEOMETRY,
        stylers: createColorStyle("#38414e"),
    },
    {
        featureType: "road",
        elementType: ElementType.GEOMETRY_STROKE,
        stylers: createStrokeStyle("#212a37"),
    },
    {
        featureType: "road",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#9ca5b3"),
    },
    {
        featureType: "road.highway",
        elementType: ElementType.GEOMETRY,
        stylers: createColorStyle("#746855"),
    },
    {
        featureType: "road.highway",
        elementType: ElementType.GEOMETRY_STROKE,
        stylers: createStrokeStyle("#1f2835"),
    },
    {
        featureType: "road.highway",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#f3d19c"),
    },
    {
        featureType: "transit",
        elementType: ElementType.GEOMETRY,
        stylers: createColorStyle("#2f3948"),
    },
    {
        featureType: "transit.station",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#d59563"),
    },
    {
        featureType: "water",
        elementType: ElementType.GEOMETRY,
        stylers: createColorStyle("#17263c"),
    },
    {
        featureType: "water",
        elementType: ElementType.LABELS_TEXT_FILL,
        stylers: createFillStyle("#515c6d"),
    },
    {
        featureType: "water",
        elementType: ElementType.LABELS_TEXT_STROKE,
        stylers: createStrokeStyle("#17263c"),
    },
];
