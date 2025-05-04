// resources/js/Pages/Checkout.jsx

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Checkout() {

  const { cartItems = [], flash = {} } = usePage().props;

  const handlePurchase = () => {
    Inertia.post(route('checkout.store'), {}, { preserveScroll: true });
  };

  return (
    <>
      <Head title="Checkout" />

      {/* Flash */}
      {flash.success && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {flash.success}
        </div>
      )}
      {flash.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          {flash.error}
        </div>
      )}

      {/* Empty state */}
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{' '}
          <Link href={route('browse')} className="text-primary underline">
            Browse books
          </Link>.
        </p>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.ebook.cover_image}
                    alt={item.ebook.title}
                    className="h-16 rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{item.ebook.title}</h3>
                    <p>
                      ${Number(item.ebook.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold">
                  ${(item.ebook.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handlePurchase}
              className="px-6 py-3 bg-primary text-white rounded hover:bg-primary-dark transition"
            >
              Complete Purchase
            </button>
          </div>
        </>
      )}
    </>
  );
}

Checkout.layout = page => (
  <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Checkout</h2>}>
    {page}
  </AuthenticatedLayout>
);
