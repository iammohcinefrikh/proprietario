import { Metadata } from "next";

import UnitsTable from "./propertiesTable";

export const metadata: Metadata = {
  title: "Proprietario - Propriétés"
};

export default function Property() {
  return (
    <UnitsTable />
  )
}