import React from "react";
import Link from "next/link";
import { BookOpenIcon, CreditCardIcon, GraduationCapIcon, ZapIcon, LogOutIcon } from "lucide-react";
import { SignedIn, SignedOut, SignOutButton, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center py-4 px-6 bg-[#e0e5ec] shadow-neumorph border-b border-transparent">
            {/* Left side: Logo */}
            <Link href="/" className="text-xl font-extrabold text-gray-700 flex items-center gap-2 shadow-neumorph px-3 py-2 rounded-xl">
                MasterClass <GraduationCapIcon className="size-6" />
            </Link>

            {/* Right side: Nav links */}
            <div className="flex items-center space-x-1 sm:space-x-4">
                <Link
                    href="/courses"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-600 shadow-neumorph hover:shadow-neumorph-inset transition"
                >
                    <BookOpenIcon className="size-4" />
                    <span className="hidden sm:inline">Courses</span>
                </Link>

                <Link
                    href="/pro"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-600 shadow-neumorph hover:shadow-neumorph-inset transition"
                >
                    <ZapIcon className="size-4" />
                    <span className="hidden sm:inline">Pro</span>
                </Link>

                {/* Only show when signed in */}
                <SignedIn>
                    <Link href={"/billing"}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#e0e5ec] text-gray-700 shadow-neumorph hover:shadow-neumorph-inset transition"
                        >
                            <CreditCardIcon className="size-4" />
                            <span className="hidden sm:inline">Billing</span>
                        </Button>
                    </Link>

                    <UserButton afterSignOutUrl="/" />

                    <SignOutButton>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#e0e5ec] text-gray-600 shadow-neumorph hover:shadow-neumorph-inset transition"
                        >
                            <LogOutIcon className="size-4" />
                            <span className="hidden sm:inline">Log out</span>
                        </Button>
                    </SignOutButton>
                </SignedIn>

                {/* If user is not signed in, show login */}
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#e0e5ec] text-gray-600 shadow-neumorph hover:shadow-neumorph-inset transition"
                        >
                            Log in
                        </Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </nav>
    );
};

export default Navbar;
