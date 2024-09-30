"use client";

import React, { useLayoutEffect, useState } from "react";

import { Loader, CircleX } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent } from "../../../components/ui/card";

import fetchLandlords from "./fetchLandlords";

interface Landlord {
  landlord: {
    landlord_id: number,
    landlord_first_name: string,
    landlord_last_name: string,
    landlord_phone_number: string,
    user: {
      user_email: string
    }
  }
}

export default function LandlordsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [landlords, setLandlords] = useState<Landlord[]>([]);

  useLayoutEffect(() => {
    const getProperties = async () => {
      try {
        const response = await fetchLandlords();
        
        if (response.statusCode === 200) {
          setLandlords(response.landlords);
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
          <p className="text-muted-foreground">Récupération des données des propriétaires...</p>
        </div>
      ) : ( isError ? (
        <div className="flex flex-row w-full gap-3 h-full justify-center items-center">
          <CircleX className="h-7 w-7 text-muted-foreground" />
          <p className="text-muted-foreground">Une erreur s'est produite lors de la récupération des propriétaires</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-lg font-bold md:text-2xl">Propriétaires</h1>
            </div>
          </div>

          { !landlords.length ? (
            <div className="flex flex-col justify-center items-center border rounded-lg w-full h-[450px] mt-16 p-4 bg-muted/50 md:p-6">
              <p className="text-sm text-muted-foreground text-center md:text-base">Il semble que vous n'ayez pas encore été ajouté à des propriétés.</p>
            </div>
          ) : (
            <Card className="mt-16">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du propriétaire</TableHead>
                      <TableHead>Numéro de téléphone du propriétaire</TableHead>
                      <TableHead>Adresse e-mail du propriétaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { landlords.map((landlord) => (
                      <TableRow key={ landlord.landlord.landlord_id }>
                        <TableCell className="font-medium">{ `${landlord.landlord.landlord_first_name} ${landlord.landlord.landlord_last_name}` }</TableCell>
                        <TableCell>{ landlord.landlord.landlord_phone_number }</TableCell>
                        <TableCell>{ landlord.landlord.user.user_email }</TableCell>
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