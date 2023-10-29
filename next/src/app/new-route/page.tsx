import { Metadata } from "next";
import NewRoute from "./new-route";

export const metadata: Metadata = {
    title: "New-Route | GeoMap",
    description: "Portifólio utilizando a API do Google Maps",
};

export function NewRoutePage() {
    return <NewRoute />;
}

export default NewRoutePage;
