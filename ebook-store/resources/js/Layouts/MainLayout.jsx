// resources/js/Layouts/MainLayout.jsx
import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function MainLayout({ children }) {
  const { auth, cartCount = 0 } = usePage().props
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/storage/img/logo.png"
              alt="ByteBooks"
              className="h-10 sm:h-12"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center space-x-6">
            <Link href={route('browse')} className="text-gray-600 hover:text-primary">
              Browse
            </Link>

            {auth.user ? (
              <>
                <Link
                  href={route('cart.index')}
                  className="relative text-gray-600 hover:text-primary"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link href={route('dashboard')} className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
                <Link
                  href={route('logout')}
                  method="post"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link href={route('login')} className="text-gray-600 hover:text-primary">
                  Login
                </Link>
                <Link
                  href={route('register')}
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="sm:hidden p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-1">
              <Link
                href={route('browse')}
                className="block px-2 py-2 rounded hover:bg-gray-100"
              >
                Browse
              </Link>

              {auth.user ? (
                <>
                  <Link
                    href={route('cart.index')}
                    className="flex items-center px-2 py-2 rounded hover:bg-gray-100"
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-2" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href={route('dashboard')}
                    className="block px-2 py-2 rounded hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={route('logout')}
                    method="post"
                    className="block w-full text-center px-2 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="block px-2 py-2 rounded hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href={route('register')}
                    className="block w-full text-center px-2 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-4 text-center">
        &copy; {new Date().getFullYear()} ByteBooks. All Rights Reserved.
      </footer>
    </div>
  )
}
