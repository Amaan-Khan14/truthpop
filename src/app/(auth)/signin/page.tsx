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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Anonymous from "../../../../public/anonymous.png";

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
      <div className="absolute top-5 left-0 flex items-center px-10">
        <Image src={Anonymous} alt="Truth Pop Logo" width={60} height={60} />
        <span className="text-2xl font-bold text-white">TruthPop</span>
      </div>
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
      <Card className="mx-2 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-4xl font-bold text-center text-white">
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
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          type="text"
                          placeholder="Email/Username"
                          className=" focus:bg-black/10 text-white bg-white/5 w-full px-10 py-2 border border-gray-500 rounded-md"
                          {...field}
                        />
                      </div>
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
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          type="password"
                          placeholder="Password"
                          className=" focus:bg-black/10 text-white bg-white/5 w-full px-10 py-2 border border-gray-500 rounded-md"
                          {...field}
                        />
                      </div>
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-black/20 rounded-b-lg">
          <div className="w-full text-center mt-5">
            <p className="text-sm text-white">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                Sign Up
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
