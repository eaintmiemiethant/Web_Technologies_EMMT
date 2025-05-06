// resources/js/Pages/Cart.jsx
import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { Inertia } from '@inertiajs/inertia'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Cart() {
  // Pull user, cart items, flash from Inertia page props
  const { auth: { user } = {}, cartItems = [], flash = {} } = usePage().props

  // Handlers for quantity update & remove
  const updateQty = (id, qty) =>
    Inertia.patch(route('cart.update', id), { quantity: qty }, {
      preserveScroll: true,
    })

  const removeItem = (id) =>
    Inertia.delete(route('cart.destroy', id), {
      preserveScroll: true,
    })

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col">
          {/* Greeting */}
          <h2 className="text-2xl font-semibold">Hi, {user.name}! 👋</h2>
          {/* Sub-header */}
          <p className="text-gray-600">Here’s your cart:</p>
        </div>
      }
    >
      {/* Flash message */}
      {flash.success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {flash.success}
        </div>
      )}

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <p className="text-gray-700">
          Your cart is empty.{' '}
          <Link href={route('browse')} className="text-primary underline">
            Browse books
          </Link>
          .
        </p>
      ) : (
        <>
          {/* List of cart items */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-b pb-4"
              >
                {/* Cover */}
                {item.ebook.cover_image && (
                  <img
                    src={item.ebook.cover_image}
                    alt={item.ebook.title}
                    className="h-20 w-16 object-cover rounded"
                  />
                )}

                {/* Title & unit price */}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.ebook.title}</h3>
                  <p className="text-gray-600">
                    ${Number(item.ebook.price).toFixed(2)} each
                  </p>
                </div>

                {/* Quantity control */}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQty(item.id, e.target.value)
                  }
                  className="w-20 text-center border rounded px-2 py-1"
                />

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="mt-8 flex items-center justify-between">
            {/* Total Price */}
            <p className="text-xl font-bold">
              Total:&nbsp;
              ${cartItems
                .reduce(
                  (sum, item) => sum + item.quantity * item.ebook.price,
                  0
                )
                .toFixed(2)}
            </p>

            {/* Checkout Button */}
            <Link
              href={route('checkout.index')}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </AuthenticatedLayout>
  )
}

Cart.layout = (page) => page