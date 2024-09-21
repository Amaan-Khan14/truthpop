"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;
  return (
    <div>
      <a href="/">Truth Pop</a>
      {session ? (
        <>
          <span>Welcome, {user?.username || user?.email}</span>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </>
      ) : (
        <>
          <Link href="/signin">Sign In</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
