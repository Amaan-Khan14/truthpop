"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Image from "next/image";
import Anonymous from "../../public/anonymous.png";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="flex items-center justify-between sticky top-0 p-5 sm:px-10 bg-transparent backdrop-filter backdrop-blur-sm bg-opacity-30 border-b border-white/10 z-50">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={Anonymous} alt="Truth Pop Logo" width={40} height={40} />
        <span className="text-xl font-bold text-white">TruthPop</span>
      </Link>
      <div className="sm:block hidden">
        <div className="flex-grow flex justify-center">
          {session && (
            <span className="text-white">
              Welcome, {user?.username || user?.email}
            </span>
          )}
        </div>
      </div>

      <div>
        {session ? (
          <Button
            onClick={() => {
              signOut();
            }}
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors duration-300"
          >
            Sign Out
          </Button>
        ) : (
          <Link
            href="/signin"
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
