"use client";

import React, { useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TriangleAlert, Loader, CirclePlus, MoreHorizontal, CircleCheck, CircleX } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";

const createFormSchema = z.object({
  tenancyName: z.string().min(1, "Veuillez saisir un nom valide.").max(64, "Le nom est trop long, veuillez en saisir un plus court."),
  tenancyStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Veuillez saisir une date de début valide." }),
  tenancyEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Veuillez saisir une date de fin valide." }),
  tenancyAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Veuillez saisir un montant valide (ex: 1000.00)."),
  unitId: z.number({ required_error: "L'identifiant de l'unité est requis.", invalid_type_error: "L'identifiant de l'unité doit être un nombre."}),
  tenantId: z.number({ required_error: "L'identifiant du locataire est requis.", invalid_type_error: "L'identifiant du locataire doit être un nombre." })
});

const modifyFormSchema = z.object({
  tenancyName: z.string().min(1, "Veuillez saisir un nom valide.").max(64, "Le nom est trop long, veuillez en saisir un plus court."),
  tenancyStartDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Veuillez saisir une date de début valide." }),
  tenancyEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Veuillez saisir une date de fin valide." }),
  tenancyAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Veuillez saisir un montant valide (ex: 1000.00)."),
  unitId: z.number({ required_error: "L'identifiant de l'unité est requis.", invalid_type_error: "L'identifiant de l'unité doit être un nombre."}),
  tenantId: z.number({ required_error: "L'identifiant du locataire est requis.", invalid_type_error: "L'identifiant du locataire doit être un nombre." })
});

interface Tenancy {
  tenancy_id: number;
  tenancy_name: string;
  tenancy_start_date: Date;
  tenancy_end_date: Date;
  unit: {
    unit_id: number;
    unit_name: string;
  };
  tenant: {
    tenant_id: number;
    tenant_first_name: string | null;
    tenant_last_name: string | null;
  };
};

export default function TenanciesTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tenancies, setTenancies] = useState<Tenancy[]>([]);

  const [createDialog, setCreateDialog] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: ""
  });

  const [modifyDialog, setModifyDialog] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: "",
    tenancyToEdit: {} as Tenancy
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: "",
    tenancyToDelete: {} as Tenancy
  });

  return (
    <>
      { isLoading ? (
        <div className="flex flex-col w-full h-full justify-center items-center">
          <Loader className="h-10 w-10 text-muted-foreground animate-spin" />
        </div>
      ) : ( isError ? (
        <div className="flex flex-col w-full h-full justify-center items-center">
          <TriangleAlert className="h-7 w-7 text-muted-foreground" />
          <h3 className="font-semibold mt-3 text-muted-foreground text-center">Une erreur s'est produite lors de la récupération des propriétés</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-lg font-bold md:text-2xl">Locataires</h1>
              <p className="text-sm text-muted-foreground mt-1">Consulter et gérer vos locataires</p>
            </div>
          </div>

          { !tenancies.length ? (
            <div className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg w-full h-[450px] mt-16 p-4 md:p-6">
              <p className="text-center text-sm text-muted-foreground md:text-base">Il semble que vous n'ayez pas encore ajouté d'unités, essayez d'en ajouter une nouvelle.</p>
            </div>
          ) : (
            <p>Values found!</p>
          ) }
        </div>
      ) ) }
    </>
  )
}