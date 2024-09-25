import { Metadata } from "next";

import TenantsTable from "./tenantsTable";

export const metadata: Metadata = {
  title: "Proprietario - Locataires"
};

export default function Tenants() {
  return (
    <>
      <TenantsTable />
    </>
  )
}