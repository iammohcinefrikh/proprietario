import { Metadata } from "next";

import TenanciesTable from "./tenanciesTable";

export const metadata: Metadata = {
  title: "Proprietario - Locations"
};

export default function Tenants() {
  return (
    <>
      <TenanciesTable />
    </>
  )
}