"use client";
import React, { useState, useEffect, useCallback, Key } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Copy } from "lucide-react";
import { MessageCard } from "@/components/MessageCard";
import { accpetMessageSchema } from "@/validator/acceptMessage";
import { Message } from "@/model/user";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof accpetMessageSchema>>({
    resolver: zodResolver(accpetMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  console.log(session);
  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get("/api/is-accepting-message");
      setValue("acceptMessages", res.data.isAcceptingMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch accepting messages status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const res = await axios.get<{ messages: Message[] }>(
          "/api/get-messages"
        );
        setMessages(res.data.messages || []);
        if (refresh) {
          toast({
            title: "Success",
            description: "Messages refreshed",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.post("/api/is-accepting-message", {
        isAcceptingMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: res.data.message,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message acceptance",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#101c3f] via-slate-900 to-slate-800">
        <div
          className="absolute inset-0 bg-repeat opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        ></div>
        <div className="relative z-10">
          <Card className="text-white w-full max-w-md backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center">
                Please login to access the dashboard.
              </p>
              <div className="flex justify-center space-x-3 mt-2 items-center">
                <Link href="/signin">
                  <Button className="bg-white/10 hover:bg-white hover:text-black">Log in</Button>
                </Link>
                <Link href="/">
                  <Button className="bg-white/10 hover:bg-white hover:text-black">Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { username } = session.user;
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const messageUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(messageUrl);
    toast({
      title: "Success",
      description: "Copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#101c3f] via-slate-900 to-slate-800 relative">
      <div
        className="absolute inset-0 bg-repeat opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          maskImage: "linear-gradient(to bottom, black, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
        }}
      ></div>
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>
          <Card className="bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-400 text-3xl">
                Message Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white">
                  Accept Messages
                </span>
                <Switch
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
              </div>
              <div className="mt-4">
                <p className="text-md mb-2 text-white">Your message URL:</p>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={messageUrl}
                    readOnly
                    className="flex-grow p-2 text-sm bg-inherit backdrop-blur-xl flex items-center space-x-2 rounded text-white"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator className="my-10 bg-white/20" />
          <Card className="bg-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-white">
                <span>Messages</span>
                <Button
                  onClick={() => fetchMessages(true)}
                  size="sm"
                  variant="outline"
                  className="text-black hover:text-white border-white/20 hover:bg-white/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageCard
                      key={message._id as Key}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400">No messages yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
