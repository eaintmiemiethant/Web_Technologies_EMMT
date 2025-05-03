import React from 'react';
import { Link } from '@inertiajs/inertia-react';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/">
                        <img
                            src="/storage/img/logo.png"
                            alt="ByteBooks Logo"
                            className="h-20"
                        />
                    </Link>
                    <nav className="space-x-4 flex items-center">
                        <Link
                            href={route("browse")}
                            className="text-gray-600 hover:text-primary"
                        >
                            Browse
                        </Link>
                        <Link
                            href="/login"
                            className="text-gray-600 hover:text-primary"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="ml-4 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition"
                        >
                            Sign Up
                        </Link>
                    </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-6">        
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} ByteBooks. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
