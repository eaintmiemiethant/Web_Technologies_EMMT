// resources/js/Pages/Orders/Show.jsx
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function OrdersShow() {
  const { order } = usePage().props;  

  // coerce to Number
  const total = Number(order.total);

  return (
    <>
      <Head title={`Order #${order.id}`} />

      <Link
        href={route('orders.index')}
        className="text-gray-600 underline mb-4 inline-block"
      >
        ← Back to My Orders
      </Link>

      <h2 className="text-2xl font-semibold mb-4">Order #{order.id}</h2>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date(order.created_at).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="capitalize">{order.status}</span>
        </div>
        <div className="flex justify-between">
          <span>Total:</span>

         <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <h3 className="mt-8 text-xl font-semibold">Items</h3>
      <div className="mt-4 space-y-4">
        {order.order_items.map((item) => {
          const unit = Number(item.unit_price);
          const line = unit * item.quantity;
          return (
            <div
              key={item.id}
              className="p-4 bg-white shadow rounded flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {item.ebook.cover_image && (
                  <img
                    src={item.ebook.cover_image}
                    alt={item.ebook.title}
                    className="h-16 rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.ebook.title}</p>
                  <p className="text-sm text-gray-600">
                   ${unit.toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold">
               ${line.toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

OrdersShow.layout = (page) => (
  <AuthenticatedLayout header={<h1 className="text-xl font-bold">Order Details</h1>}>
    {page}
  </AuthenticatedLayout>
);
