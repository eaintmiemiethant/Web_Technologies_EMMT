// resources/js/Pages/Orders/Show.jsx
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function OrdersShow() {
  const { order } = usePage().props;
  const total = Number(order.total || 0);

  return (
    <>
      <Head title={`Order #${order.id}`} />

      <div className="container mx-auto px-6 py-8">
        {/* Back Link */}
        <Link
          href={route('orders.index')}
          className="inline-block text-gray-600 hover:underline mb-6"
        >
          ← Back to My Orders
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-8">Order #{order.id}</h1>

        {/* Order Summary Card */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
            <div>
              <p className="font-medium">Date</p>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="capitalize">{order.status}</p>
            </div>
            <div>
              <p className="font-medium">Total</p>
              <p className="text-lg font-semibold">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-6">
          {order.order_items.map((item) => {
            const unit = Number(item.unit_price || 0);
            const qty  = Number(item.quantity || 1);
            const lineTotal = unit * qty;
            const fileUrl   = item.ebook.file_path; // ensure your controller sends file_path

            return (
              <div
                key={item.id}
                className="bg-white shadow-sm rounded-lg p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
              >
                {/* Left: Cover + title + qty/price */}
                <div className="flex items-center space-x-4">
                  {item.ebook.cover_image && (
                    <img
                      src={item.ebook.cover_image}
                      alt={item.ebook.title}
                      className="h-20 w-auto rounded-md object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.ebook.title}</p>
                    <p className="text-sm text-gray-600">
                      ${unit.toFixed(2)} × {qty}
                    </p>
                  </div>
                </div>

                {/* Right: Line total + Download button */}
                <div className="flex flex-col items-end space-y-2">
                  <p className="text-lg font-semibold">
                    ${lineTotal.toFixed(2)}
                  </p>

                  {order.status === 'paid' && fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                    >
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// Wrap with AuthenticatedLayout
OrdersShow.layout = (page) => (
  <AuthenticatedLayout
    header={<h2 className="text-xl font-semibold">Order Details</h2>}
  >
    {page}
  </AuthenticatedLayout>
);