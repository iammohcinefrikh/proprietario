"use client";

import React, { useLayoutEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart";
import { CircleX, House, Loader, TrendingDown, TrendingUp, Users } from "lucide-react";

import getStats from "./getStats";

const barChartConfig = {
  cashed: {
    label: "Earned",
    color: "#18181C"
  },
  spent: {
    label: "Spent",
    color: "#FBD5DA"
  },
} satisfies ChartConfig;

const pieChartConfig = {
  Rented: { label: "Loué" },
  Vacant: { label: "Vacante" }
} satisfies ChartConfig

export default function DashboardWidgets() {
  const [stats, setStats] = useState({
    units: 0,
    tenants: 0,
    spent: 0,
    cashed: 0,
    cashflow: [],
    cashflowdp: false,
    occupancy: { "rented": 0, "vacant": 0 },
    occupancydp: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const pieChartData = [
    { properties: "Rented", count: stats.occupancy.rented, fill: "#18181C" },
    { properties: "Vacant", count: stats.occupancy.vacant, fill: "#FBD5DA" }
  ];

  useLayoutEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getStats();
        
        if (response?.statusCode === 200) {
          setStats(response?.stats);
        }

        else {
          setIsError(true);
        }
      }

      catch (error) {
        setIsError(true);
      }
      
      finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      { isLoading ? (
        <div className="flex flex-row w-full gap-3 h-full justify-center items-center">
          <Loader className="h-7 w-7 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Récupération des données du tableau de bord...</p>
        </div>
      ) : ( isError ? (
        <div className="flex flex-row w-full gap-3 h-full justify-center items-center">
          <CircleX className="h-7 w-7 text-muted-foreground" />
          <p className="text-muted-foreground">Une erreur s'est produite lors de la récupération des statistiques</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold md:text-2xl">Tableau de bord</h1>
            <p className="text-sm text-muted-foreground mt-1">Informations et activités en temps réel sur vos propriétés</p>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row md:gap-6">
            <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-medium leading-none tracking-tight">Propriétés</p>
                <House className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-4">{ stats.units }</div>
            </div>
            <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-medium leading-none tracking-tight">Locataires</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-4">{ stats.tenants }</div>
            </div>
            <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-medium leading-none tracking-tight">Dépensé</p>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-4 text-rose-600">{ stats.spent + " DH" }</div>
            </div>
            <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
              <div className="flex flex-row justify-between items-center">
                <p className="text-sm font-medium leading-none tracking-tight">Encaissé</p>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold mt-4 text-green-600">{ stats.cashed + " DH" }</div>
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row md:gap-6">
            <Card className="basis-2/3">
              <CardHeader>
                <div className="grid gap-2">
                  <CardTitle>Trésorerie</CardTitle>
                  <CardDescription>Répartition annuelle des dépenses et des revenus</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                  { stats.cashflowdp ? (
                    <ChartContainer config={barChartConfig} className="aspect-auto w-full h-[250px] mt-6">
                      <BarChart accessibilityLayer data={stats.cashflow}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip cursor={{fill: "rgba(0, 0, 0, 0.1)"}} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" />
                      </BarChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex flex-col justify-center items-center w-full h-[250px] mt-6 border rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground text-center md:text-base">Il n'y a pas encore de données à afficher.</p>
                    </div>
                  ) }
              </CardContent>
            </Card>

            <Card className="basis-1/3">
              <CardHeader>
                <div className="grid gap-2">
                  <CardTitle>Occupation</CardTitle>
                  <CardDescription>Répartition des propriété par statut d'occupation</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                { stats.occupancydp ? (
                  <ChartContainer config={pieChartConfig} className="mx-auto aspect-square w-full h-[250px] mt-6">
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Pie data={pieChartData} dataKey="count" nameKey="properties" innerRadius={60} />
                    </PieChart>
                  </ChartContainer>
                ) : (
                  <div className="flex flex-col justify-center items-center w-full h-[250px] mt-6 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground text-center md:text-base">Il n'y a pas encore de données à afficher.</p>
                  </div>
                ) }
              </CardContent>
            </Card>
          </div>
        </div>
      ) ) }
    </>
  )
}