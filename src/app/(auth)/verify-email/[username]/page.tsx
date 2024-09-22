"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import TopLeftSVG from "../../../left.svg";
import BottomRightSVG from "../../../right.svg";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/apiResponse";
import { verifySchema } from "@/validator/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import Anonymous from "../../../../../public/anonymous.png";

export default function VerifyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/verify", {
        username: params.username,
        verifyCode: data.code,
      });

      toast({
        title: "Success",
        description: res.data.message,
      });

      router.replace("/signin");
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
            Verify Account
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 mt-6"
            >
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-200">
                      Verification Code
                    </FormLabel>
                    <FormMessage className="text-red-400" />
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        {...field}
                        className="flex justify-center gap-2 sm:gap-4"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="w-9 h-12 sm:w-12 sm:h-14 rounded-md bg-white bg-opacity-20 border-gray-400 text-white text-2xl"
                          />
                          <InputOTPSlot
                            index={1}
                            className="w-9 h-12 sm:w-12 sm:h-14 rounded-md bg-white bg-opacity-20 border-gray-400 text-white text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-gray-400">
                          -
                        </InputOTPSeparator>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={2}
                            className="w-9 h-12 sm:w-12 sm:h-14 rounded-md bg-white bg-opacity-20 border-gray-400 text-white text-2xl"
                          />
                          <InputOTPSlot
                            index={3}
                            className="w-9 h-12 sm:w-12 sm:h-14 rounded-md bg-white bg-opacity-20 border-gray-400 text-white text-2xl"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator className="text-gray-400">
                          -
                        </InputOTPSeparator>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={4}
                            className="w-9 h-12 sm:w-12 sm:h-14 rounded-md bg-white bg-opacity-20 border-gray-400 text-white text-2xl"
                          />
                          <InputOTPSlot
                            index={5}
                            className="w-9 h-12 sm:w-12 sm:h-14 rounded-md bg-white bg-opacity-20 border-gray-400 text-white text-2xl"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
