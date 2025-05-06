// resources/js/Pages/Orders/Index.jsx

import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'   
import { Inertia } from '@inertiajs/inertia'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function OrdersIndex() {
  const { orders = {}, flash = {} } = usePage().props
  const { data = [], links = [] } = orders

  return (
    <>
      <Head title="My Orders" />

      <AuthenticatedLayout
        header={
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800">My Orders</h2>
            <p className="text-gray-600">Review past purchases and download e-books.</p>
          </div>
        }
      >
        <div className="container mx-auto p-6">
          {/* Flash */}
          {flash.success && (
            <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-800">
              {flash.success}
            </div>
          )}

          {data.length === 0 ? (
            <div className="rounded-lg bg-white/60 backdrop-blur-lg p-6 text-center">
              <p className="text-gray-700">You have not placed any orders yet.</p>
              <Link
                href={route('browse')}
                className="mt-4 inline-block text-primary hover:underline"
              >
                ← Continue browsing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white/60 backdrop-blur-lg shadow">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Order #</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((order) => {
                    const total = Number(order.total || 0)
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-800">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold text-gray-800">
                          ${total.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm capitalize text-gray-700">
                          {order.status}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-sm">
                          <Link
                            href={route('orders.show', order.id)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {links.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {links.map((link, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={!link.url}
                  onClick={() => link.url && Inertia.get(link.url, {}, { preserveState: true })}
                  className={`
                    px-3 py-1 text-sm font-medium rounded
                    ${link.active
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'}
                    disabled:opacity-50
                  `}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </AuthenticatedLayout>
    </>
  )
}

OrdersIndex.layout = (page) => page
