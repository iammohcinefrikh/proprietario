"use client";

import React, { useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TriangleAlert, RefreshCw, CirclePlus, MoreHorizontal, CircleCheck, CircleX } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import fetchProperties from "./fetchProperties";
import createProperty from "./createProperty";
import modifyProperty from "./modifyProperty";
import deleteProperty from "./deleteProperty";

const formSchema = z.object({
  unitName: z.string().min(1, "Veuillez saisir un nom de propriété").max(128, "Le nom de la propriété est trop long, veuillez en saisir un plus court."),
  unitType: z.enum(["house", "flat", "room", "other"], { required_error: "Veuillez sélectionner un type de propriété" })
});

interface Unit {
  unit_id: number,
  unit_name: string,
  unit_type: "house" | "flat" | "room" | "other",
  unit_created_at: string
}

export default function PropertiesTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

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
    unitToEdit: {} as Unit
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: "",
    unitToDelete: {} as Unit
  });

  const createForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: "",
      unitType: undefined
    }
  });

  const modifyForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: "",
      unitType: undefined
    }
  });

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

  const handleOpenChange = (open: boolean) => {
    setCreateDialog(prevState => ({
      ...prevState,
      isOpen: open
    }));
  };

  const handleEditOpen = (unit: Unit) => {
    modifyForm.reset({
      unitName: unit.unit_name,
      unitType: unit.unit_type
    });

    setModifyDialog((prevState) => ({
      ...prevState,
      isOpen: true,
      unitToEdit: unit
    }));
  };

  const handleDeleteOpen = (unit: Unit) => {
    setDeleteDialog(prevState => ({
      ...prevState,
      isOpen: true,
      unitToDelete: unit
    }));
  };

  const handlePropertyCreation = async (values: z.infer<typeof formSchema>) => {
    setCreateDialog(prevState => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));

    try {
      const response = await createProperty(values.unitName, values.unitType);

      if (response?.statusCode === 200) {
        setUnits([...units, response?.unit]);
        
        setCreateDialog(prevState => ({
          ...prevState,
          successMessage: response.message,
          isSuccess: true
        }));
      }
      
      else {
        setCreateDialog(prevState => ({
          ...prevState,
          errorMessage: response?.message || "Une erreur inattendue s'est produite.",
          isError: true
        }));
      }
    }
    
    catch (error) {
      setCreateDialog(prevState => ({
        ...prevState,
        errorMessage: "Une erreur inattendue s'est produite.",
        isError: true
      }));
    } 
    
    finally {
      setCreateDialog(prevState => ({
        ...prevState,
        isLoading: false
      }));
    }
  };

  const handlePropertyModification = async (values: z.infer<typeof formSchema>) => {
    setModifyDialog(prevState => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));

    try {
      const response = await modifyProperty(modifyDialog.unitToEdit?.unit_id, values.unitName, values.unitType);

      if (response.statusCode === 200) {
        setUnits((prevUnits) => prevUnits.map((unit) => unit.unit_id === modifyDialog.unitToEdit?.unit_id ? { ...unit, unit_name: values.unitName, unit_type: values.unitType } : unit));
        
        setModifyDialog(prevState => ({
          ...prevState,
          isSuccess: true,
          successMessage: response.message
        }));
      }
      
      else {
        setModifyDialog(prevState => ({
          ...prevState,
          isError: true,
          errorMessage: response.message
        }));
      }
    }
    
    catch (error) {
      setModifyDialog(prevState => ({
        ...prevState,
        isError: true,
        errorMessage: "Une erreur inattendue s'est produite."
      }));
    }
    
    finally {
      setModifyDialog(prevState => ({
        ...prevState,
        isLoading: false
      }));
    }
  };

  const handlePropertyDeletion = async () => {
    setDeleteDialog((prevState) => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));
  
    try {
      const response = await deleteProperty(deleteDialog.unitToDelete.unit_id);
  
      if (response.statusCode === 200) {
        setUnits((prevUnits) => prevUnits.filter((unit) => unit.unit_id !== deleteDialog.unitToDelete.unit_id));

        setDeleteDialog((prevState) => ({
          ...prevState,
          isSuccess: true,
          successMessage: response.message
        }));
      }
      
      else {
        setDeleteDialog((prevState) => ({
          ...prevState,
          isError: true,
          errorMessage: response.message
        }));
      }
    }
    
    catch (error) {
      setDeleteDialog((prevState) => ({
        ...prevState,
        isError: true,
        errorMessage: "Une erreur inattendue s'est produite."
      }));
    }
    
    finally {
      setDeleteDialog((prevState) => ({
        ...prevState,
        isLoading: false
      }));
    }
  };

  return (
    <>
      { isLoading ? (
        <div className="flex flex-col w-full h-full justify-center items-center">
          <RefreshCw className="h-10 w-10 text-muted-foreground animate-spin" />
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
              <h1 className="text-lg font-bold md:text-2xl">Propriétés</h1>
              <p className="text-sm text-muted-foreground mt-1">Consulter et gérer vos propriétés</p>
            </div>

            <Dialog open={createDialog.isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <CirclePlus className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Ajouter une propriété</span>
                </Button>
              </DialogTrigger>
              <DialogContent showCloseIcon={false}>
                { !createDialog.isLoading && !createDialog.isSuccess && !createDialog.isError ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Ajouter une propriété</DialogTitle>
                      <DialogDescription>Remplissez le formulaire ci-dessous pour ajouter un nouveau propriété</DialogDescription>
                    </DialogHeader>
                    <Form {...createForm}>
                      <form onSubmit={createForm.handleSubmit(handlePropertyCreation)} className="grid gap-4 mt-4">
                        <FormField control={createForm.control} name="unitName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de propriété</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="La Falaise" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={createForm.control} name="unitType" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de propriété</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="house">Maison</SelectItem>
                                <SelectItem value="flat">Appartement</SelectItem>
                                <SelectItem value="room">Chambre</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <Button variant="outline" onClick={(e) => { e.preventDefault(); setCreateDialog(prevState => ({ ...prevState, isOpen: false})); createForm.reset({ unitName: "", unitType: undefined }); }}>Annuler</Button>
                          <Button type="submit" className="w-full">Ajouter</Button>
                        </div>
                      </form>
                    </Form>
                  </>
                ) : createDialog.isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <RefreshCw className="animate-spin h-8 w-8" />
                    <p className="text-sm text-muted-foreground">L'ajout de la propriété...</p>
                  </div>
                ) : createDialog.isSuccess ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleCheck className="h-8 w-8 stroke-green-600" />
                        <p className="text-base font-medium text-green-600">{createDialog.successMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setCreateDialog(prevState => ({ ...prevState, isOpen: false, isSuccess: false, successMessage: "" })); createForm.reset({ unitName: "", unitType: undefined }); }}>Fermer</Button>
                  </>
                ) : createDialog.isError ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleX className="h-8 w-8 stroke-rose-600" />
                        <p className="text-base font-medium text-rose-600">{createDialog.errorMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setCreateDialog(prevState => ({ ...prevState, isOpen: false, isError: false, errorMessage: "" })); createForm.reset({ unitName: "", unitType: undefined }); }}>Fermer</Button>
                  </>
                ) : null}
              </DialogContent>
            </Dialog>

            <Dialog open={modifyDialog.isOpen} onOpenChange={(open) => setModifyDialog((prevState) => ({ ...prevState, isOpen: open }))}>
              <DialogContent showCloseIcon={false}>
                { !modifyDialog.isLoading && !modifyDialog.isSuccess && !modifyDialog.isError ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Modifier la propriété</DialogTitle>
                      <DialogDescription>Modifiez les détails de la propriété ci-dessous</DialogDescription>
                    </DialogHeader>
                    <Form {...modifyForm}>
                      <form onSubmit={modifyForm.handleSubmit(handlePropertyModification)} className="grid gap-4 mt-4">
                        <FormField control={modifyForm.control} name="unitName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom de propriété</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="La Falaise" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={modifyForm.control} name="unitType" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type de propriété</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="house">Maison</SelectItem>
                                <SelectItem value="flat">Appartement</SelectItem>
                                <SelectItem value="room">Chambre</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <Button variant="outline" onClick={(e) => { e.preventDefault(); setModifyDialog((prevState) => ({ ...prevState, isOpen: false })); modifyForm.reset({ unitName: "", unitType: undefined }); }}>Annuler</Button>
                          <Button type="submit" className="w-full">Mettre à jour</Button>
                        </div>
                      </form>
                    </Form>
                  </> 
                ) : modifyDialog.isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <RefreshCw className="animate-spin h-8 w-8" />
                    <p className="text-sm text-muted-foreground">Modification de la propriété...</p>
                  </div>
                ) : modifyDialog.isSuccess ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleCheck className="h-8 w-8 stroke-green-600" />
                        <p className="text-base font-medium text-green-600">{modifyDialog.successMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setModifyDialog(prevState => ({ ...prevState, isOpen: false, isSuccess: false, successMessage: "" })); modifyForm.reset({ unitName: "", unitType: undefined }); }}>Fermer</Button>
                  </>
                ) : modifyDialog.isError ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleX className="h-8 w-8 stroke-rose-600" />
                        <p className="text-base font-medium text-rose-600">{modifyDialog.errorMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setModifyDialog(prevState => ({ ...prevState, isOpen: false, isError: false, errorMessage: "" })); modifyForm.reset({ unitName: "", unitType: undefined }); }}>Fermer</Button>
                  </>
                ) : null}
              </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog((prevState) => ({ ...prevState, isOpen: open }))}>
              <DialogContent showCloseIcon={false}>
                { !deleteDialog.isLoading && !deleteDialog.isSuccess && !deleteDialog.isError ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Supprimer la propriété</DialogTitle>
                      <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Button variant="outline" onClick={(e) => { e.preventDefault(); setDeleteDialog((prevState) => ({ ...prevState, isOpen: false })); }}>Annuler</Button>
                      <Button variant="destructive" onClick={handlePropertyDeletion} className="w-full">Supprimer</Button>
                    </div>
                  </>
                ) : deleteDialog.isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <RefreshCw className="animate-spin h-8 w-8" />
                    <p className="text-sm text-muted-foreground">Suppression de la propriété...</p>
                  </div>
                ) : deleteDialog.isSuccess ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleCheck className="h-8 w-8 stroke-green-600" />
                        <p className="text-base font-medium text-green-600">{deleteDialog.successMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setDeleteDialog(prevState => ({ ...prevState, isOpen: false, isSuccess: false, successMessage: "" })); }}>Fermer</Button>
                  </>
                ) : deleteDialog.isError ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleX className="h-8 w-8 stroke-rose-600" />
                        <p className="text-base font-medium text-rose-600">{deleteDialog.errorMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setDeleteDialog(prevState => ({ ...prevState, isOpen: false, isError: false, errorMessage: "" })); }}>Fermer</Button>
                  </>
                ) : null}
              </DialogContent>
            </Dialog>
          </div>

          { !units.length ? (
            <div className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg w-full h-[450px] mt-16 p-4 md:p-6">
              <p className="text-center text-sm text-muted-foreground md:text-base">Il semble que vous n'ayez pas encore ajouté d'unités, essayez d'en ajouter une nouvelle.</p>
            </div>
          ) : (
            <Card className="mt-16">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom de propriété</TableHead>
                      <TableHead>Type de propriété</TableHead>
                      <TableHead>Ajouté à</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { units.map((unit) => (
                      <TableRow key={unit.unit_id}>
                        <TableCell className="font-medium">{unit.unit_name}</TableCell>
                        <TableCell>
                          { unit.unit_type === "flat" ? "Appartement" : unit.unit_type === "house" ? "Maison" : unit.unit_type === "room" ? "Chambre" : "Autre" }
                        </TableCell>
                        <TableCell>
                          { new Date(unit.unit_created_at).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }) }
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Menu à bascule</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditOpen(unit)}>Modifier</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteOpen(unit)}>Supprimer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) }
        </div>
      ) ) }
    </>
  )
}