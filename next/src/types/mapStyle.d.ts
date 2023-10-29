declare module MapStyle {
    interface Data {
        elementType: string;
        stylers: Stylers[];
        featureType?: string;
    }

    interface Stylers {
        color: string;
    }
}
