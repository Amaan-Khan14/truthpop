"use client"
import { BackgroundBeams } from "@/components/ui/background-beams";
import Image from "next/image";
import Anonymous from "../../public/anonymous.png";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { GlareCard } from "@/components/ui/glare-card";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/message.json";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigation = (path: string) => {
    router.replace(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#141519] relative overflow-hidden">
      <div className="relative z-10">
        <nav className="sticky top-0 flex items-center justify-between p-5 sm:px-10 bg-transparent backdrop-filter backdrop-blur-sm bg-opacity-30 border-b border-white/10">
          <a href="/" className="flex items-center space-x-2">
            <Image
              src={Anonymous}
              alt="Truth Pop Logo"
              width={60}
              height={60}
            />
            <span className="text-2xl font-bold text-white">TruthPop</span>
          </a>
          <div className="hidden sm:block">
            <Button
              onClick={() => handleNavigation("/signin")}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white hover:bg-white hover:text-black transition-colors duration-300 mx-5"
            >
              Sign In
            </Button>
            <Button
              onClick={() => handleNavigation("/signup")}
              variant="outline"
              size="sm"
              className="bg-white/10 text-white border-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              Get Started
            </Button>
          </div>

          <div className="sm:hidden block">
            <Button
              onClick={toggleMenu}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              <Menu />
            </Button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="absolute top-[81px] left-0 right-0 bg-[#141519] bg-opacity-90 sm:hidden z-50">
            <div className="flex flex-col p-4 space-y-2">
              <Button
                onClick={() => handleNavigation("/signin")}
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors duration-300 w-full"
              >
                Sign In
              </Button>
              <Button
                onClick={() => handleNavigation("/signup")}
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors duration-300 w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
        <main className="container mx-auto px-4 py-16 text-center text-white relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Unlock the Power of Anonymous Truth
          </h1>
          <p className="text-xl mb-12">
            Where honesty meets mystery, and friendships grow stronger.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <GlareCard className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4">
                🎭 One Account, Endless Possibilities
              </h2>
              <p>
                Create your TruthPop account and dive into a world where
                curiosity reigns supreme.
              </p>
            </GlareCard>
            <GlareCard className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4">
                🚀 No Strings Attached
              </h2>
              <p>
                Your friends can send anonymous messages without creating an
                account. It is that simple!
              </p>
            </GlareCard>
            <GlareCard className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4">
                🔗 Share Your Link, Spark Conversations
              </h2>
              <p>
                Drop your public link in your group chat and watch the anonymous
                messages roll in.
              </p>
            </GlareCard>
            <GlareCard className="p-6 flex flex-col items-center justify-center">
              <div className="flex items-center">
                <Image src={Anonymous} alt="Anonymous" width={55} height={55} />
                <h2 className="text-2xl font-semibold mb-4">Anonymous</h2>
              </div>

              <p className="text-lg font-medium">
                Feel the excitement as anonymous messages come your way,
                creating a thrilling experience!
              </p>
            </GlareCard>
          </div>
          <Separator className="bg-white/20 mb-14" />
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Carousel className="w-full">
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="sm:basis-1/2 lg:basis-1/3"
                  >
                    <Card className="bg-slate-700/30 rounded-3xl border-white/10">
                      <CardHeader className="text-white/80">
                        <span className="text-sm md:text-base">
                          {message.date}
                        </span>
                        <span className="text-xl text-white/50 font-semibold">
                          From Unknown
                        </span>
                        <span className="text-xl text-white font-semibold">
                          {message.title}
                        </span>
                        <CardContent className="text-white/80">
                          {message.content}
                        </CardContent>
                      </CardHeader>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white/10 hidden sm:flex" />
              <CarouselNext className="bg-white/10 hidden sm:flex" />
            </Carousel>
          </div>
          <Separator className="bg-white/20 mt-14" />
          <h2 className="text-3xl font-bold my-12">Ready to get started?</h2>
          <Button
            onClick={() => handleNavigation("/signup")}
            size="lg"
            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            Start Your TruthPop Journey
          </Button>
        </main>
      </div>

      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
    </div>
  );
}


