"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CircleCheck, CircleX, Loader } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form";

import checkInvitation from "./checkInvitation";
import confirmInvitation from "./confirmInvitation";

const paramsSchema = z.object({
  landlordId: z.string().transform((val) => parseInt(val, 10)),
  tenantId: z.string().transform((val) => parseInt(val, 10)),
  invitationToken: z.string().length(64).regex(/^[A-Za-z0-9]+$/)
});

const formSchema = z.object({
  userPassword: z.string().min(8, { message: "Veuillez saisir un mot de passe valide." }).max(32, { message: "Le mot de passe est trop long." })
});

export default function ActivationStatus() {
  const params = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userPassword: ""
    }
  });

  const validateParams = () => {
    const result = paramsSchema.safeParse({
      landlordId: params.landlordId,
      tenantId: params.tenantId,
      invitationToken: params.invitationToken
    });

    return result;
  };

  useEffect(() => {
    const verifyUserInvitation = async () => {
      const result = validateParams();
  
      if (result.success) {
        try {
          const response = await checkInvitation(result.data.landlordId, result.data.tenantId, result.data.invitationToken);

          if (response.statusCode === 200) {
            setIsValid(true);
          }

          else {
            setIsError(true);
            setErrorMessage(response.message);
          }
        }

        catch (error) {
          setIsError(true);
          setErrorMessage("Une erreur s'est produite lors de la verification de l'invitation.");
        }
      }
      
      else {
        setIsError(true);
        setErrorMessage("Le lien d'acceptation n'est pas valide, veuillez vérifier s'il est valide et réessayer.");
      }

      setIsLoading(false);
    };
  
    verifyUserInvitation();
  }, [params]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = validateParams();

      if (result.success) {
        const response = await confirmInvitation(result.data.landlordId, result.data.tenantId, values.userPassword, result.data.invitationToken);

        if (response.statusCode === 200) {
          setIsSuccess(true);
        }

        else {
          setIsError(true);
          setErrorMessage(response.message);
        }
      }

      else {
        setIsError(true);
        setErrorMessage("Une erreur s'est produite lors de la confirmation de l'invitation.");
      }
    }

    catch (error) {
      setIsError(true);
      setErrorMessage("Une erreur s'est produite lors de la confirmation de l'invitation.");
    }
  }

  return (
    <main className="flex h-screen items-center justify-center p-6">
      {isLoading ? (
        <div className="flex flex-row">
          <Loader className="animate-spin" />
          <p className="ml-3">Vérification de l'invitation...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col justify-center items-center sm:w-[350px]">
          <CircleX className="h-14 w-14 stroke-rose-600" />
          <h1 className="text-2xl font-semibold tracking-tight mt-6 text-center">Erreur d'activation du compte</h1>
          <p className="white text-sm text-muted-foreground mt-2 mb-6 text-center">{errorMessage}</p>
        </div>
      ) : isSuccess ? (
        <div className="flex flex-col justify-center items-center sm:w-[350px]">
          <CircleCheck className="h-14 w-14 stroke-green-600" />
          <h1 className="text-2xl font-semibold tracking-tight mt-6 text-center">Succès</h1>
          <p className="white text-sm text-muted-foreground mt-2 mb-6 text-center">Votre compte a été activé avec succès.</p>
        </div>
      ) : isValid ? (
        <div className="flex flex-col sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Configurer votre compte</h1>
            <p className="white text-sm text-muted-foreground">Saisissez vos informations ci-dessous pour activer votre compte</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 mt-4">
              <FormField control={form.control} name="userPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Choisissez un mot de passe fort et unique pour sécuriser votre compte.</FormDescription>
                </FormItem>
              )} />
              <Button type="submit" className="w-full">Accepter l'invitation</Button>
            </form>
          </Form>
        </div>
      ) : null}
    </main>
  );
}