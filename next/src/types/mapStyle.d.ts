declare module MapStyle {
    interface Data {
        elementType: ElementType;
        stylers: Stylers[];
        featureType?: string;
    }

    interface Stylers {
        color: string;
    }
}

enum ElementType {
    GEOMETRY = "geometry",
    GEOMETRY_STROKE = "geometry.stroke",
    LABELS_TEXT_STROKE = "labels.text.stroke",
    LABELS_TEXT_FILL = "labels.text.fill",
}
