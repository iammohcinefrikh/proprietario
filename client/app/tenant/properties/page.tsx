import { Metadata } from "next";

import PropertiesTable from "./propertiesTable";

export const metadata: Metadata = {
  title: "Proprietario - Propriétés"
};

export default function Property() {
  return (
    <PropertiesTable />
  )
}