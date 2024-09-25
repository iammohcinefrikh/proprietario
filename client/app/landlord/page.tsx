import { Metadata } from "next";

import DashboardWidgets from "./dashboardWidgets";

export const metadata: Metadata = {
  title: "Proprietario - Tableau de bord"
};

export default function Landlord() {
  return (
    <DashboardWidgets />
  )
}