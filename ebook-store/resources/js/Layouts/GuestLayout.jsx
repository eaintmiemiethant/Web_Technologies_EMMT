// resources/js/Layouts/GuestLayout.jsx
import React from "react";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-white shadow">
                <div className="container mx-auto p-6 flex justify-between items-center">
                    {/* Logo: clicking takes you back to “/” (LandingPage) */}
                    <Link href="/">
                        <img
                            src="/storage/img/logo.png"
                            alt="ByteBooks Logo"
                            className="h-16"
                        />
                    </Link>

                    <nav className="space-x-4">
                        <Link
                            href={route("browse")}
                            className="text-gray-600 hover:text-primary"
                        >
                            Browse
                        </Link>
                        <Link
                            href={route("login")}
                            className="text-gray-600 hover:text-primary"
                        >
                            Login
                        </Link>
                        <Link
                            href={route("register")}
                            className="ml-4 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark"
                        >
                            Sign Up
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-6 flex items-center justify-center">
                {children}
            </main>

            <footer className="bg-gray-800 text-gray-400 py-6 text-center">
                &copy; {new Date().getFullYear()} ByteBooks. All Rights
                Reserved.
            </footer>
        </div>
    );
}
