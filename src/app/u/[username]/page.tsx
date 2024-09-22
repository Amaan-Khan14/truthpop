"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { messageSchema } from "@/validator/message";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Mail, Send, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Anonymous from "../../../../public/anonymous.png";

export default function SendMessage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [, setIsCheckingRecipient] = useState(true);

  const params = useParams();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const checkRecipientStatus = async () => {
      setIsCheckingRecipient(true);
      try {
        const res = await axios.get(
          `/api/is-accepting-messages?username=${params.username}`
        );
        setIsAcceptingMessages(res.data.isAcceptingMessages);
      } catch (error) {
        console.error("Error checking recipient status:", error);
        toast({
          title: "Error",
          description: "Failed to check recipient status",
          variant: "destructive",
        });
        setIsAcceptingMessages(false);
      } finally {
        setIsCheckingRecipient(false);
      }
    };

    if (params.username) {
      checkRecipientStatus();
    }
  }, [params.username, toast]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!isAcceptingMessages) {
      toast({
        title: "Error",
        description: "This user is not accepting messages at the moment.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/send-message/`, {
        username: params.username,
        message: data.content,
      });

      toast({
        title: "Success",
        description: res.data.message,
      });
      router.replace(`/`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#101c3f] via-slate-900 to-slate-800 min-h-screen flex flex-col">
      <nav className="sticky top-0 p-5 sm:px-10 bg-transparent backdrop-filter backdrop-blur-sm bg-opacity-30 border-b border-white/10 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={Anonymous} alt="Truth Pop Logo" width={60} height={60} />
          <span className="text-2xl font-bold text-white">TruthPop</span>
        </Link>
      </nav>
      <div
        className="absolute inset-0 bg-repeat opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      />
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center justify-center">
            <Mail className="mr-2" /> Send a Message
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Send a message...."
                        className="bg-white/10 text-white placeholder-gray-400 w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300 flex items-center justify-center"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="ml-2" size={18} />
              </Button>
            </form>
          </Form>
          <Separator className="my-6 bg-white/10" />
          <Button
            className="bg-white/10 hover:bg-white/20 w-full cursor-pointer text-white"
            onClick={() => router.replace("/signup")}
          >
            <UserPlus className="mr-2" size={18} />
            Create Your Account
          </Button>
        </div>
      </main>
    </div>
  );
}
