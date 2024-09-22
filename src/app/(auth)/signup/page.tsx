"use client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/apiResponse";
import { signUpSchema } from "@/validator/signUp";
import TopLeftSVG from "../../left.svg";
import BottomRightSVG from "../../right.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Anonymous from "../../../../public/anonymous.png";
import axios, { AxiosError } from "axios";

export default function Component() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  //zod validation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const res = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;

          toast({
            title: "Error",
            description:
              axiosError.response?.data.message || "An error occurred",
          });
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/signup", data);
      if (res.data.success) {
        toast({
          title: "Success",
          description: res.data.message,
        });
        router.replace(`/verify-email/${data.username}`);
      } else {
        toast({
          title: "Error",
          description: res.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "An error occurred",
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
        width={250}
        height={250}
        className="absolute top-4 left-0 w-1/4 h-auto sm:block hidden"
      />
      <Image
        src={TopLeftSVG}
        alt="Decorative shape"
        width={30}
        height={300}
        className="absolute bottom-0 right-0 w-1/3 h-auto sm:block hidden"
      />
      <Card className="mx-2 w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-4xl font-bold text-center text-white">Sign Up</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <FormControl>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            type="text"
                            placeholder="Username"
                            className=" focus:bg-black/10 px-10 text-white bg-white/5 w-full py-2 border border-gray-500 rounded-md"
                            {...field}
                            onChange={(event) => {
                              field.onChange(event);
                              debouncedUsername(event.target.value);
                            }}
                          />
                        </div>
                      </FormControl>
                      {isCheckingUsername && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 animate-spin text-white" />
                      )}
                    </div>
                    {usernameMessage && (
                      <p
                        className={`mt-1 text-sm ${
                          usernameMessage === "Username is available"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          type="email"
                          placeholder="Email"
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
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="bg-black/20 rounded-b-lg">
          <div className="w-full text-center mt-5">
            <p className="text-sm text-white">
              Already have an account?{" "}
              <a
                href="/signin"
                className="font-medium text-indigo-300 hover:text-indigo-200 transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
