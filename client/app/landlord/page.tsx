"use client";

import * as React from "react";

import { Bar, BarChart, CartesianGrid, XAxis, Label, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, House, TrendingDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const pieChartData = [
  { property: "Rented", visitors: 275, fill: "#18181C" },
  { property: "Vacant", visitors: 200, fill: "#FBD5DA" }
];

const barChartConfig = {
  desktop: {
    label: "Earned",
    color: "#18181C"
  },
  mobile: {
    label: "Spent",
    color: "#FBD5DA"
  },
} satisfies ChartConfig;

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  }
} satisfies ChartConfig;

export default function Landlord() {
  const totalVisitors = React.useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold md:text-2xl">Vue d'ensemble</h1>
        <p className="text-sm text-muted-foreground mt-1">Informations et activités en temps réel sur vos propriétés</p>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row lg:gap-7">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Propriétés
              </CardTitle>
              <House className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">172</div>
              <p className="text-xs text-muted-foreground">
                +9% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Locataires
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +21% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dépensé</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4750,25 DH</div>
              <p className="text-xs text-muted-foreground">
                +7% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Encaissé</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">70249,75 DH</div>
              <p className="text-xs text-muted-foreground">
                +2% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="grid gap-2">
                <CardTitle>Trésorerie</CardTitle>
                <CardDescription>Répartition annuelle des dépenses et des revenus</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="aspect-auto w-full h-[250px] mt-6">
                <BarChart accessibilityLayer data={barChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                  <ChartTooltip cursor={{fill: "rgba(0, 0, 0, 0.1)"}} content={<ChartTooltipContent indicator="line" />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="grid gap-2">
                <CardTitle>Occupation</CardTitle>
                <CardDescription>Répartition des propriété par statut d'occupation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={pieChartConfig} className="mx-auto aspect-square w-full max-h-[250px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={pieChartData} dataKey="visitors" nameKey="properties" innerRadius={60}>
                    <Label content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {totalVisitors.toLocaleString()}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                Properties
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
    </>
  )
}