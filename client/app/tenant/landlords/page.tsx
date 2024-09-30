import { Metadata } from "next";

import LandlordsTable from "./landlordsTable";

export const metadata: Metadata = {
  title: "Proprietario - Propriétaires"
};

export default function LandlordsPage() {
  return (
    <LandlordsTable />
  )
}