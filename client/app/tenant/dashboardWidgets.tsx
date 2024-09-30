"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Info, FilePlus2, MessageSquarePlus, KeyRound, DollarSign } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function DashboardWidgets() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold md:text-2xl">Tableau de bord</h1>
      </div>

      <div className="flex flex-col flex-1 gap-4 justify-center items-center p-6 border rounded-lg shadow-sm lg:flex-row">
        <Button className="flex flex-col w-full p-4 h-50 lg:w-auto" variant="ghost">
          <Info className="mb-3 h-6 w-6" />
          <p>Nouvelle demande</p>
        </Button>
        <Button className="flex flex-col w-full p-4 h-50 lg:w-auto" variant="ghost">
          <MessageSquarePlus className="mb-3 h-6 w-6" />
          <p>Nouveau message</p>
        </Button>
        <Button className="flex flex-col w-full p-4 h-50 lg:w-auto" variant="ghost">
          <FilePlus2 className="mb-3 h-6 w-6" />
          <p>Nouveau document</p>
        </Button>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row md:gap-6">

        <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm font-medium leading-none tracking-tight">Locations</p>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mt-4">0</div>
        </div>

        <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm font-medium leading-none tracking-tight">Loyers en retard</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold mt-4">0</div>
        </div>

        <div className="flex flex-col flex-1 justify-between p-6 border rounded-lg shadow-sm">
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm font-medium leading-none tracking-tight">Demandes</p>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold mt-4">0</div>
              <div className="text-sm text-muted-foreground">Ouvert</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold mt-4">0</div>
              <div className="text-sm text-muted-foreground">Fermé</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold mt-4">0</div>
              <div className="text-sm text-muted-foreground">En cours</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row md:gap-6">
        <Card className="basis-2/3">
          <CardHeader>
            <div className="grid gap-2">
              <CardTitle>Alertes</CardTitle>
              <CardDescription>Recevez des notifications et des mises à jour importantes concernant vos locations et propriétés louées</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
                <div className="flex flex-col justify-center items-center w-full h-[250px] mt-6 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground text-center md:text-base">Il n'y a pas encore d'alertes à afficher.</p>
                </div>
          </CardContent>
        </Card>
        <Card className="basis-2/3">
          <CardHeader>
            <div className="grid gap-2">
              <CardTitle>Messages</CardTitle>
              <CardDescription>Accédez et gérez vos communications avec vos propriétaires</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
                <div className="flex flex-col justify-center items-center w-full h-[250px] mt-6 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground text-center md:text-base">Il n'y a pas encore de messages à afficher.</p>
                </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}