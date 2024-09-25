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
import { CircleCheck, TriangleAlert } from "lucide-react";

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
  
  const [userType, setUserType] = useState("landlord");
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
    const response = await registerUser(values.userFirstName, values.userLastName, values.userEmail, values.userPassword, userType);
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
          <div className="flex flex-col items-center text-center">
            <CircleCheck className="h-14 w-14 stroke-green-600" />
            <h1 className="text-2xl font-semibold tracking-tight mt-6">Compte créé avec succès</h1>
            <p className="white text-sm text-muted-foreground mt-2 mb-6">Vous recevrez un e-mail de confirmation pour activer votre compte, veuillez cliquer sur le lien qu'il contient pour terminer votre inscription.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
              <p className="white text-sm text-muted-foreground">Saisissez vos informations ci-dessous pour créer votre compte</p>
            </div>
            { isError && (
              <Alert variant="destructive" className="mt-4">
                <TriangleAlert className="w-5 h-5" />
                <AlertTitle className="text-sm text-primary">Erreur</AlertTitle>
                <AlertDescription className="text-muted-foreground">{errorMessage}</AlertDescription>
              </Alert>
            ) }
            <Label className="mt-6">Je suis</Label>
            <Tabs onValueChange={(value) => {setUserType(value)}} value={userType} className="w-full mt-3">
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