// resources/js/Pages/Dashboard.jsx
import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'

export default function Dashboard() {
  // Grab the current user from Inertia props
  const { auth: { user } = {} } = usePage().props

  return (
    <AuthenticatedLayout
      header={<h2 className="text-2xl font-semibold">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="space-y-6">
        {/* Greeting */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-medium">
            Welcome back, {user.name}!
          </h3>
          <p className="text-gray-600 mt-2">
            {user.is_admin
              ? 'As an admin, you can manage e-books and users from here.'
              : 'Here you can view your cart and past purchases.'}
          </p>
        </div>

        {user.is_admin ? (
          // ─── ADMIN PANEL ───────────────────────────────
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href={route('admin.ebooks.index')}
              className="block p-6 bg-blue-50 border border-blue-200 rounded-lg shadow hover:bg-blue-100 transition"
            >
              <h4 className="font-semibold text-lg mb-2">Manage E-Books</h4>
              <p className="text-blue-700">Add, edit or delete book catalog entries.</p>
            </Link>

            <Link
              href={route('admin.users.index')}
              className="block p-6 bg-green-50 border border-green-200 rounded-lg shadow hover:bg-green-100 transition"
            >
              <h4 className="font-semibold text-lg mb-2">Manage Users</h4>
              <p className="text-green-700">View, edit or remove registered users.</p>
            </Link>
          </div>
        ) : (
          // ─── REGULAR USER PANEL ────────────────────────
          <div className="grid sm:grid-cols-2 gap-6">
            <Link
              href={route('cart.index')}
              className="block p-6 bg-purple-50 border border-purple-200 rounded-lg shadow hover:bg-purple-100 transition"
            >
              <h4 className="font-semibold text-lg mb-2">Your Cart</h4>
              <p className="text-purple-700">View or modify items you’ve added to your cart.</p>
            </Link>

            <Link
              href={route('orders.index')}
              className="block p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow hover:bg-yellow-100 transition"
            >
              <h4 className="font-semibold text-lg mb-2">Your Orders</h4>
              <p className="text-yellow-700">See order history and download past purchases.</p>
            </Link>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

Dashboard.layout = page => page
