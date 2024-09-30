"use client";

import React, { useLayoutEffect, useState } from "react";

import { Loader, CircleX } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent } from "../../../components/ui/card";

import fetchProperties from "./fetchProperties";

interface Unit {
  unit_id: number,
  unit_name: string,
  unit_type: "house" | "flat" | "room" | "other"
  landlord: {
    landlord_first_name: string,
    landlord_last_name: string
  }
}

export default function PropertiesTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

  useLayoutEffect(() => {
    const getProperties = async () => {
      try {
        const response = await fetchProperties();
        
        if (response?.statusCode === 200) {
          setUnits(response?.units);
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

    getProperties();
  }, []);

  return (
    <>
      { isLoading ? (
        <div className="flex flex-row w-full gap-3 h-full justify-center items-center">
          <Loader className="h-7 w-7 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Récupération des données de propriétés...</p>
        </div>
      ) : ( isError ? (
        <div className="flex flex-row w-full gap-3 h-full justify-center items-center">
          <CircleX className="h-7 w-7 text-muted-foreground" />
          <p className="text-muted-foreground">Une erreur s'est produite lors de la récupération des propriétés</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-lg font-bold md:text-2xl">Propriétés</h1>
            </div>
          </div>

          { !units.length ? (
            <div className="flex flex-col justify-center items-center border rounded-lg w-full h-[450px] mt-16 p-4 bg-muted/50 md:p-6">
              <p className="text-sm text-muted-foreground text-center md:text-base">Il semble que vous n'ayez pas encore été ajouté à des propriétés.</p>
            </div>
          ) : (
            <Card className="mt-16">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom de propriété</TableHead>
                      <TableHead>Type de propriété</TableHead>
                      <TableHead>Propriétaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { units.map((unit) => (
                      <TableRow key={ unit.unit_id }>
                        <TableCell className="font-medium">{ unit.unit_name }</TableCell>
                        <TableCell>
                          { unit.unit_type === "flat" ? "Appartement" : unit.unit_type === "house" ? "Maison" : unit.unit_type === "room" ? "Chambre" : "Autre" }
                        </TableCell>
                        <TableCell>
                          { `${unit.landlord.landlord_first_name} ${unit.landlord.landlord_last_name}` }
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) }
        </div>
      )) }
    </>
  )
}