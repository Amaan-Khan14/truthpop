"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/validator/signIn";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import TopLeftSVG from "../../left.svg";
import BottomRightSVG from "../../right.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function SignInComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (res?.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#141519]">
      <Image
        src={BottomRightSVG}
        alt="Decorative shape"
        className="absolute top-4 left-0 w-1/4 h-auto sm:block hidden"
      />
      <Image
        src={TopLeftSVG}
        alt="Decorative shape"
        className="absolute bottom-0 right-0 w-1/3 h-auto sm:block hidden"
      />
      <div className="mx-2 w-full max-w-sm p-4">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Log in to your account
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Email/Username"
                      className="w-full bg-inherit px-3 py-2 border shadow-[0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)] border-gray-300 rounded-md focus:bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      className="w-full bg-inherit px-3 py-2 border border-gray-300 rounded-md focus:bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-sm text-center text-white">
          Not a member yet?{" "}
          <a
            href="/signup"
            className="font-medium text-indigo-300 hover:text-indigo-200"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
