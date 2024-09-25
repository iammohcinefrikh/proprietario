"use client";

import React, { useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TriangleAlert, RefreshCw, CirclePlus, MoreHorizontal, CircleCheck, CircleX } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import fetchTenants from "./fetchTenants";
import createTenant from "./createTenant";
import modifyTenant from "./modifyTenant";
import deleteTenant from "./deleteTenant";
import inviteTenant from "./inviteTenant";

const createFormSchema = z.object({
  tenantFirstName: z.string().min(1, "Veuillez saisir un prénom valide.").max(32, "Le prénom est trop long, veuillez en saisir un plus court."),
  tenantLastName: z.string().min(1, "Veuillez saisir un nom valide.").max(32, "Le nom de famille est trop long, veuillez en saisir un plus court."),
  tenantPhoneNumber: z.string().regex(/^0[5-9]\d{8}$/, "Le numéro de téléphone doit être au format 0XXXXXXXXX."),
  tenantEmail: z.string().min(1, { message: "L'adresse email est requise." }).email({ message: "Veuillez saisir une adresse email valide." }),
  tenantIsInvited: z.boolean()
});

const modifyFormSchema = z.object({
  tenantFirstName: z.string().min(1, "Veuillez saisir un prénom valide.").max(32, "Le prénom est trop long, veuillez en saisir un plus court."),
  tenantLastName: z.string().min(1, "Veuillez saisir un nom valide.").max(32, "Le nom de famille est trop long, veuillez en saisir un plus court."),
  tenantPhoneNumber: z.string().regex(/^0[5-9]\d{8}$/, "Le numéro de téléphone doit être au format 0XXXXXXXXX.")
});

interface Tenant {
  tenant_id: number;
  tenant_first_name: string;
  tenant_last_name: string;
  tenant_phone_number: string;
  user: {
    user_email: string;
  };
  landlord_has_tenant: Array<{
    invitation_status: "not_invited" | "pending" | "accepted";
  }>;
  tenancy: Array<{
    unit: {
      unit_name: string;
    };
  }>;
}

export default function TenantsTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);

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
    tenantToEdit: {} as Tenant
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: "",
    tenantToDelete: {} as Tenant
  });

  const [inviteDialog, setInviteDialog] = useState({
    isOpen: false,
    isLoading: false,
    isSuccess: false,
    successMessage: "",
    isError: false,
    errorMessage: "",
    tenantToInvite: {} as Tenant
  });

  const createForm = useForm<z.infer<typeof createFormSchema>>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      tenantFirstName: "",
      tenantLastName: "",
      tenantEmail: "",
      tenantPhoneNumber: "",
      tenantIsInvited: false
    }
  });

  const modifyForm = useForm<z.infer<typeof modifyFormSchema>>({
    resolver: zodResolver(modifyFormSchema),
    defaultValues: {
      tenantFirstName: "",
      tenantLastName: "",
      tenantPhoneNumber: ""
    }
  });

  useLayoutEffect(() => {
    const getTenants = async () => {
      try {
        const response = await fetchTenants();
        
        if (response?.statusCode === 200) {
          setTenants(response?.tenants);
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

    getTenants();
  }, []);

  const handleOpenChange = (open: boolean) => {
    setCreateDialog(prevState => ({
      ...prevState,
      isOpen: open
    }));
  };

  const handleEditOpen = (tenant: any) => {
    modifyForm.reset({
      tenantFirstName: tenant.tenant_first_name,
      tenantLastName: tenant.tenant_last_name,
      tenantPhoneNumber: tenant.tenant_phone_number
    });

    setModifyDialog((prevState) => ({
      ...prevState,
      isOpen: true,
      tenantToEdit: tenant
    }));
  };

  const handleDeleteOpen = (tenant: Tenant) => {
    setDeleteDialog(prevState => ({
      ...prevState,
      isOpen: true,
      tenantToDelete: tenant
    }));
  };

  const handleInviteOpen = (tenant: Tenant) => {
    setDeleteDialog(prevState => ({
      ...prevState,
      isOpen: true,
      tenantToInvite: tenant
    }));
  };

  const handleTenantCreation = async (values: z.infer<typeof createFormSchema>) => {
    setCreateDialog(prevState => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));

    try {
      const response = await createTenant(values.tenantFirstName, values.tenantLastName, values.tenantEmail, values.tenantPhoneNumber, values.tenantIsInvited);

      if (response?.statusCode === 200) {
        setTenants([...tenants, response.tenant]);
        
        setCreateDialog(prevState => ({
          ...prevState,
          successMessage: response.message,
          isSuccess: true
        }));
      }
      
      else {
        setCreateDialog(prevState => ({
          ...prevState,
          errorMessage: response.message,
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

  const handleTenantModification = async (values: z.infer<typeof modifyFormSchema>) => {
    setModifyDialog(prevState => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));

    try {
      const response = await modifyTenant(modifyDialog.tenantToEdit.tenant_id, values.tenantFirstName, values.tenantLastName, values.tenantPhoneNumber);

      if (response.statusCode === 200) {
        setTenants((prevTenants) => prevTenants.map((tenant) => tenant.tenant_id === modifyDialog.tenantToEdit?.tenant_id ? { ...tenant, tenant_first_name: values.tenantFirstName, tenant_last_name: values.tenantLastName, tenant_phone_number: values.tenantPhoneNumber } : tenant));
        
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

  const handleTenantDeletion = async () => {
    setDeleteDialog((prevState) => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));
  
    try {
      const response = await deleteTenant(deleteDialog.tenantToDelete.tenant_id);
  
      if (response.statusCode === 200) {
        setTenants((prevTenants) => prevTenants.filter((tenant) => tenant.tenant_id !== deleteDialog.tenantToDelete.tenant_id));

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

  const handleTenantInvitation = async () => {
    setInviteDialog(prevState => ({
      ...prevState,
      isLoading: true,
      isSuccess: false,
      successMessage: "",
      isError: false,
      errorMessage: ""
    }));

    try {
      const response = await inviteTenant(inviteDialog.tenantToInvite.tenant_id)

      if (response.statusCode === 200) {
        setTenants((prevTenants) => prevTenants.map((tenant) => tenant.tenant_id === inviteDialog.tenantToInvite?.tenant_id ? { ...tenant, landlord_has_tenant: [ ...tenant.landlord_has_tenant, { invitation_status: "pending" }] } : tenant));
        
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
              <h1 className="text-lg font-bold md:text-2xl">Locataires</h1>
              <p className="text-sm text-muted-foreground mt-1">Consulter et gérer vos locataires</p>
            </div>

            <Dialog open={createDialog.isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <CirclePlus className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Ajouter un locataire</span>
                </Button>
              </DialogTrigger>
              <DialogContent showCloseIcon={false}>
                { !createDialog.isLoading && !createDialog.isSuccess && !createDialog.isError ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Ajouter un locataire</DialogTitle>
                      <DialogDescription>Remplissez le formulaire ci-dessous pour ajouter un nouveau locatiare</DialogDescription>
                    </DialogHeader>
                    <Form {...createForm}>
                      <form onSubmit={createForm.handleSubmit(handleTenantCreation)} className="grid gap-4 mt-4">
                        <FormField control={createForm.control} name="tenantFirstName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom du locataire</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={createForm.control} name="tenantLastName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du locataire</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={createForm.control} name="tenantPhoneNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone du locataire</FormLabel>
                            <FormControl>
                              <Input type="phone" placeholder="0XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={createForm.control} name="tenantEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email du locataire</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={createForm.control} name="tenantIsInvited" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Invitation du locataire</FormLabel>
                              <FormControl className="block">
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormDescription>Si vous souhaitez inviter votre locataire à Proprietario et lui donner accès à l'application, activez cette option.</FormDescription>
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <Button variant="outline" onClick={(e) => { e.preventDefault(); setCreateDialog(prevState => ({ ...prevState, isOpen: false})); createForm.reset({ tenantFirstName: "", tenantLastName: "", tenantPhoneNumber: "", tenantEmail: "", tenantIsInvited: false }); }}>Annuler</Button>
                          <Button type="submit" className="w-full">Ajouter</Button>
                        </div>
                      </form>
                    </Form>
                  </>
                ) : createDialog.isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <RefreshCw className="animate-spin h-8 w-8" />
                    <p className="text-sm text-muted-foreground">Ajout du locataire...</p>
                  </div>
                ) : createDialog.isSuccess ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleCheck className="h-8 w-8 stroke-green-600" />
                        <p className="text-base font-medium text-green-600">{createDialog.successMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setCreateDialog(prevState => ({ ...prevState, isOpen: false, isSuccess: false, successMessage: "" })); createForm.reset({ tenantFirstName: "", tenantLastName: "", tenantPhoneNumber: "", tenantEmail: "", tenantIsInvited: false }); }}>Fermer</Button>
                  </>
                ) : createDialog.isError ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleX className="h-8 w-8 stroke-rose-600" />
                        <p className="text-base font-medium text-rose-600">{createDialog.errorMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setCreateDialog(prevState => ({ ...prevState, isOpen: false, isError: false, errorMessage: "" })); createForm.reset({ tenantFirstName: "", tenantLastName: "", tenantPhoneNumber: "", tenantEmail: "", tenantIsInvited: false }); }}>Fermer</Button>
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
                      <form onSubmit={modifyForm.handleSubmit(handleTenantModification)} className="grid gap-4 mt-4">
                      <FormField control={modifyForm.control} name="tenantFirstName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom du locataire</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={modifyForm.control} name="tenantLastName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du locataire</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <FormField control={modifyForm.control} name="tenantPhoneNumber" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Numéro de téléphone du locataire</FormLabel>
                            <FormControl>
                              <Input type="phone" placeholder="0XXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <Button variant="outline" onClick={(e) => { e.preventDefault(); setModifyDialog((prevState) => ({ ...prevState, isOpen: false })); modifyForm.reset({ tenantFirstName: "", tenantLastName: "", tenantPhoneNumber: "" }); }}>Annuler</Button>
                          <Button type="submit" className="w-full">Mettre à jour</Button>
                        </div>
                      </form>
                    </Form>
                  </> 
                ) : modifyDialog.isLoading ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <RefreshCw className="animate-spin h-8 w-8" />
                    <p className="text-sm text-muted-foreground">Modification du locataire...</p>
                  </div>
                ) : modifyDialog.isSuccess ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleCheck className="h-8 w-8 stroke-green-600" />
                        <p className="text-base font-medium text-green-600">{modifyDialog.successMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setModifyDialog(prevState => ({ ...prevState, isOpen: false, isSuccess: false, successMessage: "" })); modifyForm.reset({ tenantFirstName: "", tenantLastName: "", tenantPhoneNumber: "" }); }}>Fermer</Button>
                  </>
                ) : modifyDialog.isError ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <CircleX className="h-8 w-8 stroke-rose-600" />
                        <p className="text-base font-medium text-rose-600">{modifyDialog.errorMessage}</p>
                      </div>
                    </div>
                    <Button onClick={(e) => { e.preventDefault(); setModifyDialog(prevState => ({ ...prevState, isOpen: false, isError: false, errorMessage: "" })); modifyForm.reset({ tenantFirstName: "", tenantLastName: "", tenantPhoneNumber: "" }); }}>Fermer</Button>
                  </>
                ) : null}
              </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog((prevState) => ({ ...prevState, isOpen: open }))}>
              <DialogContent showCloseIcon={false}>
                { !deleteDialog.isLoading && !deleteDialog.isSuccess && !deleteDialog.isError ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Supprimer le locataire</DialogTitle>
                      <DialogDescription>Etes-vous sûr de vouloir supprimer ce locataire? Cette action est irréversible.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" onClick={(e) => { e.preventDefault(); setDeleteDialog((prevState) => ({ ...prevState, isOpen: false })); }}>Annuler</Button>
                      <Button variant="destructive" onClick={handleTenantDeletion} className="w-full">Supprimer</Button>
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

          { !tenants.length ? (
            <div className="flex flex-col justify-center items-center border-2 border-dashed rounded-lg w-full h-[450px] mt-16 p-4 md:p-6">
              <p className="text-center text-sm text-muted-foreground md:text-base">Il semble que vous n'ayez pas encore ajouté d'unités, essayez d'en ajouter une nouvelle.</p>
            </div>
          ) : (
            <Card className="mt-16">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom et prénom</TableHead>
                      <TableHead>Propriété</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { tenants.map((tenant) => {
                      if (tenant.tenancy.length === 0) {
                        return (
                          <TableRow key={tenant.tenant_id}>
                            <TableCell className="font-medium">{`${tenant.tenant_first_name} ${tenant.tenant_last_name}`}</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{tenant.tenant_phone_number}</TableCell>
                            <TableCell>{tenant.user.user_email}</TableCell>
                            <TableCell>{tenant.landlord_has_tenant[0].invitation_status === "not_invited" ? <Badge className="cursor-pointer">Inviter</Badge> : tenant.landlord_has_tenant[0].invitation_status === "pending" ? <Badge variant="outline">En attente</Badge> : <Badge variant="secondary">Actif</Badge>}</TableCell>
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
                                  <DropdownMenuItem onClick={() => handleEditOpen(tenant)}>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteOpen(tenant)}>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      } else if (tenant.tenancy.length === 1) {
                        return (
                          <TableRow key={tenant.tenant_id}>
                            <TableCell className="font-medium">{`${tenant.tenant_first_name} ${tenant.tenant_last_name}`}</TableCell>
                            <TableCell>{tenant.tenancy[0].unit.unit_name}</TableCell>
                            <TableCell>{tenant.tenant_phone_number}</TableCell>
                            <TableCell>{tenant.user.user_email}</TableCell>
                            <TableCell>{tenant.landlord_has_tenant[0].invitation_status === "not_invited" ? <Badge className="cursor-pointer">Inviter</Badge> : tenant.landlord_has_tenant[0].invitation_status === "pending" ? <Badge variant="outline">En attente</Badge> : <Badge variant="secondary">Actif</Badge>}</TableCell>
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
                                  <DropdownMenuItem onClick={() => handleEditOpen(tenant)}>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteOpen(tenant)}>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      } else {
                        return tenant.tenancy.map((tenancy, index) => (
                          <TableRow key={`${tenant.tenant_id}-${index}`}>
                            <TableCell className="font-medium">{`${tenant.tenant_first_name} ${tenant.tenant_last_name}`}</TableCell>
                            <TableCell>{tenancy.unit?.unit_name || "N/A"}</TableCell>
                            <TableCell>{tenant.tenant_phone_number}</TableCell>
                            <TableCell>{tenant.user.user_email}</TableCell>
                            <TableCell>{tenant.landlord_has_tenant[0].invitation_status === "not_invited" ? <Badge className="cursor-pointer">Inviter</Badge> : tenant.landlord_has_tenant[0].invitation_status === "pending" ? <Badge variant="outline">En attente</Badge> : <Badge variant="secondary">Actif</Badge>}</TableCell>
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
                                  <DropdownMenuItem onClick={() => handleEditOpen(tenant)}>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteOpen(tenant)}>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ));
                      }
                    }) }
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