"use client";

import { useState } from "react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import registerUser from "@/utils/registerUserUtil";

const registerFormSchema = z.object({
  userFirstName: z.string()
    .min(1, { message: "Veuillez saisir un prénom valide." })
    .max(32, { message: "Le prénom est trop long." }),
  userLastName: z.string()
    .min(1, { message: "Veuillez saisir un nom valide." })
    .max(32, { message: "Le nom est trop long." }),
  userEmail: z.string()
    .min(1, { message: "L'adresse email est requise." })
    .email({ message: "Veuillez saisir une adresse email valide." }),
  userPassword: z.string()
    .min(8, { message: "Veuillez saisir un mot de passe valide." })
    .max(32, { message: "Le mot de passe est trop long." })
});

export default function RegisterForm() {
  
  const [userRole, setUserRole] = useState("landlord");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      userFirstName: "",
      userLastName: "",
      userEmail: "",
      userPassword: ""
    }
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    const response = await registerUser(values.userFirstName, values.userLastName, values.userEmail, values.userPassword, userRole);
    setIsLoading(true);

    if (response?.statusCode === 201) {
      setIsLoading(false);
      setIsSuccess(true);
    }

    else {
      if (response?.statusCode === 409) {
        form.setError("userEmail", {
          type: "manual",
          message: response?.message
        });

        form.setValue("userPassword", "");
        setIsLoading(false);
      }

      else if (response?.statusCode === 500) {
        setIsError(true);
        setErrorMessage(response?.message);

        form.setValue("userPassword", "");
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
        { isSuccess ? (
          <div className="flex flex-col text-center">
            <div className="flex justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21508 0.913451 7.4078C0.00519941 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.807 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0865C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6934 24 14.3734 24 12C23.9966 8.81843 22.7313 5.76814 20.4816 3.51843C18.2319 1.26872 15.1816 0.00335979 12 0ZM17.2685 9.88384L10.8069 16.3454C10.7212 16.4312 10.6194 16.4993 10.5073 16.5457C10.3953 16.5922 10.2752 16.6161 10.1538 16.6161C10.0325 16.6161 9.91243 16.5922 9.80037 16.5457C9.68831 16.4993 9.5865 16.4312 9.50077 16.3454L6.73154 13.5762C6.55834 13.4029 6.46103 13.168 6.46103 12.9231C6.46103 12.6781 6.55834 12.4432 6.73154 12.27C6.90475 12.0968 7.13967 11.9995 7.38462 11.9995C7.62957 11.9995 7.86449 12.0968 8.0377 12.27L10.1538 14.3873L15.9623 8.57769C16.0481 8.49193 16.1499 8.4239 16.2619 8.37748C16.374 8.33107 16.4941 8.30718 16.6154 8.30718C16.7367 8.30718 16.8568 8.33107 16.9688 8.37748C17.0809 8.4239 17.1827 8.49193 17.2685 8.57769C17.3542 8.66345 17.4223 8.76527 17.4687 8.87732C17.5151 8.98938 17.539 9.10948 17.539 9.23077C17.539 9.35206 17.5151 9.47216 17.4687 9.58421C17.4223 9.69627 17.3542 9.79808 17.2685 9.88384Z" fill="#34C759"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight mt-6">Compte créé avec succès</h1>
            <p className="white text-sm text-muted-foreground mt-2 mb-6">Vous recevrez un e-mail de confirmation pour activer votre compte, veuillez cliquer sur le lien qu'il contient pour terminer votre inscription.</p>
            <Link href="/login" className="text-blue-600 text-sm underline underline-offset-4 hover:text-blue-900">Connectez-vous à votre compte</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
              <p className="white text-sm text-muted-foreground">Saisissez vos informations ci-dessous pour créer votre compte</p>
            </div>
            { isError && (
              <Alert variant="destructive" className="mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.25C10.0716 2.25 8.18657 2.82183 6.58319 3.89317C4.97982 4.96452 3.73013 6.48726 2.99218 8.26884C2.25422 10.0504 2.06114 12.0108 2.43735 13.9021C2.81355 15.7934 3.74215 17.5307 5.10571 18.8943C6.46928 20.2579 8.20656 21.1865 10.0979 21.5627C11.9892 21.9389 13.9496 21.7458 15.7312 21.0078C17.5127 20.2699 19.0355 19.0202 20.1068 17.4168C21.1782 15.8134 21.75 13.9284 21.75 12C21.7473 9.41498 20.7192 6.93661 18.8913 5.10872C17.0634 3.28084 14.585 2.25273 12 2.25ZM11.25 7.5C11.25 7.30109 11.329 7.11032 11.4697 6.96967C11.6103 6.82902 11.8011 6.75 12 6.75C12.1989 6.75 12.3897 6.82902 12.5303 6.96967C12.671 7.11032 12.75 7.30109 12.75 7.5V12.75C12.75 12.9489 12.671 13.1397 12.5303 13.2803C12.3897 13.421 12.1989 13.5 12 13.5C11.8011 13.5 11.6103 13.421 11.4697 13.2803C11.329 13.1397 11.25 12.9489 11.25 12.75V7.5ZM12 17.25C11.7775 17.25 11.56 17.184 11.375 17.0604C11.19 16.9368 11.0458 16.7611 10.9606 16.5555C10.8755 16.35 10.8532 16.1238 10.8966 15.9055C10.94 15.6873 11.0472 15.4868 11.2045 15.3295C11.3618 15.1722 11.5623 15.065 11.7805 15.0216C11.9988 14.9782 12.225 15.0005 12.4305 15.0856C12.6361 15.1708 12.8118 15.315 12.9354 15.5C13.059 15.685 13.125 15.9025 13.125 16.125C13.125 16.4234 13.0065 16.7095 12.7955 16.9205C12.5845 17.1315 12.2984 17.25 12 17.25Z" fill="currentColor"/>
                </svg>
                <AlertTitle className="text-sm">Erreur</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) }
            <Label className="mt-6">Je suis</Label>
            <Tabs onValueChange={(value) => {setUserRole(value)}} value={userRole} className="w-full mt-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="landlord">Propriétaire</TabsTrigger>
                <TabsTrigger value="tenant">Locataire</TabsTrigger>
              </TabsList>
              <TabsContent value="landlord">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 mt-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="userFirstName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prénom</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="userLastName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    <FormField control={form.control} name="userEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="userPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <p className="text-center text-sm text-muted-foreground">
                      En cliquant sur créer un compte, vous acceptez nos{" "}<Link href="/terms" className="text-muted-foreground underline underline-offset-4 hover:text-primary">Conditions de Service</Link>{" "}et{" "}<Link href="/privacy" className="text-muted-foreground underline underline-offset-4 hover:text-primary">Politique de Confidentialité</Link>.
                    </p>
                    <Button type="submit" className="w-full" disabled={isLoading}>Créer un compte{isLoading && "..."}</Button>
                  </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                  Vous avez déjà un compte?{" "}
                  <Link href="/login" className="text-blue-600 text-sm underline underline-offset-4 hover:text-blue-900">Se connecter</Link>
                </div>
              </TabsContent>
              <TabsContent value="tenant">
                <p className="text-sm font-semibold text-center mt-7">Demandez à votre propriétaire de vous inviter.</p>
                <p className="text-sm mt-2 text-center text-zinc-600">Une fois que vous avez reçu l'invitation par e-mail, suivez le lien pour confirmer votre inscription.</p>
              </TabsContent>
            </Tabs>
          </>
        ) }
        </div>
      </div>
    </>
  )
}