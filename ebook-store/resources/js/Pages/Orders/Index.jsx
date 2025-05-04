import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function OrdersIndex({ orders }) {
  return (
    <>
      <Head title="My Orders" />
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {orders.data.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.data.map(order => (
            <div key={order.id} className="p-4 bg-white rounded shadow flex justify-between">
              <div>
                <p>
                  <span className="font-semibold">Order #{order.id}</span>{' '}
                  <span className="text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Total:{' '}
                  <span className="font-bold">
                    ${Number(order.total).toFixed(2)}
                  </span>
                </p>
                <p className="mt-1 text-sm capitalize">Status: {order.status}</p>
              </div>
              <Link
                href={route('orders.show', order.id)}
                className="text-primary hover:underline self-center"
              >
                View Details →
              </Link>
            </div>
          ))}

          {/* pagination */}
          <div className="mt-6 flex justify-center space-x-2">
            {orders.links.map((link, idx) => (
              <button
                key={idx}
                onClick={() =>
                  link.url && Inertia.get(link.url, {}, { preserveState: true })
                }
                disabled={!link.url}
                className={`px-3 py-1 border rounded ${
                  link.active
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } disabled:opacity-50`}
              >
                <span dangerouslySetInnerHTML={{ __html: link.label }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

OrdersIndex.layout = page => (
  <AuthenticatedLayout header={<h1 className="text-xl font-bold">Orders</h1>}>
    {page}
  </AuthenticatedLayout>
);
