import type { Metadata } from "next";
import { Lab } from "./Lab";

export const metadata: Metadata = {
  title: "Cannonball 3D Lab",
  description: "Inspeção técnica de assets e cenas 3D, sem modificar os arquivos originais.",
};

export default function Home() {
  return <Lab />;
}
