// resources/js/Layouts/GuestLayout.jsx
import React, { useState } from "react";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="/storage/img/logo.png"
                alt="ByteBooks Logo"
                className="h-12 sm:h-16"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-6">
              <Link
                href={route("browse")}
                className="text-gray-600 hover:text-primary transition"
              >
                Browse
              </Link>
              <Link
                href={route("login")}
                className="text-gray-600 hover:text-primary transition"
              >
                Login
              </Link>
              <Link
                href={route("register")}
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition"
              >
                Sign Up
              </Link>
            </nav>

            {/* Mobile Hamburger */}
            <div className="sm:hidden">
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? (
                  // X icon
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-4 space-y-1">
              <Link
                href={route("browse")}
                className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition"
              >
                Browse
              </Link>
              <Link
                href={route("login")}
                className="block px-4 py-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition"
              >
                Login
              </Link>
              <Link
                href={route("register")}
                className="block px-4 py-2 bg-primary text-white text-center rounded-full hover:bg-primary-dark transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center">
        &copy; {new Date().getFullYear()} ByteBooks. All Rights Reserved.
      </footer>
    </div>
  );
}