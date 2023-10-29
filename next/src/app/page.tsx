import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "GeoMap",
    description: "Portifólio utilizando a API do Google Maps",
};

export default function Home() {
    return (
        <main className="flex min-h-screen h-full w-full flex-col items-center justify-between bg-globe-gif bg-no-repeat bg-center bg-cover">
            <div className="flex flex-col gap-4 h-full w-full bg-gray-800 bg-opacity-60 text-center justify-center items-center">
                <h1 className="text-yellow-500 text-6xl font-bold">GeoMap</h1>
                <h4 className="text-gray-200">
                    Portifólio utilizando a API do Google Maps
                </h4>
                <Link
                    href="/new-route"
                    className="flex h-12 border-yellow-500 bg-gray-400/20 font-bold text-gray-100 border-2 rounded text-center justify-center items-center px-32 hover:bg-yellow-500 transition-all"
                >
                    Buscar Rotas
                </Link>
                <p className="my-12 text-gray-200">
                    Desenvolvido por{" "}
                    <a
                        href="https://github.com/M4ciel"
                        target="_blank"
                        className="text-yellow-400 hover:underline transition-all"
                    >
                        Caio Maciel
                    </a>
                </p>
            </div>
        </main>
    );
}
