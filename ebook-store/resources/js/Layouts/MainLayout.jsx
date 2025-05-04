// resources/js/Layouts/MainLayout.jsx
import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function MainLayout({ children }) {
  const { auth, cartCount = 0 } = usePage().props

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            {/* Logo */}
            <img src="/storage/img/logo.png" alt="Logo" className="h-12" />
          </Link>

          <nav className="flex items-center space-x-4">
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
                  className="ml-4 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark"
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
                  className="ml-4 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow container mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center">
        &copy; {new Date().getFullYear()} ByteBooks. All Rights Reserved.
      </footer>
    </div>
  )
}
