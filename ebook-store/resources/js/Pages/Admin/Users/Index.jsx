// resources/js/Pages/Admin/Users/Index.jsx
import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { Inertia } from '@inertiajs/inertia'

export default function UsersIndex() {
  const { users, sort, direction, flash } = usePage().props
  // users: { data: [...], links: [...] }
  // sort & direction come from query string (if you want sorting)

  // flip direction helper
  const nextDirection = (column) =>
    sort === column && direction === 'asc' ? 'desc' : 'asc'

  // trigger Inertia get with sort params
  const handleSort = (column) => {
    Inertia.get(
      route('admin.users.index'),
      { sort: column, direction: nextDirection(column) },
      { preserveState: true, replace: true }
    )
  }

  // render arrow if sorted
  const SortIcon = ({ column }) => {
    if (sort !== column) return null
    return direction === 'asc' ? (
      <ChevronUpIcon className="inline-block h-4 w-4 ml-1 text-gray-600" />
    ) : (
      <ChevronDownIcon className="inline-block h-4 w-4 ml-1 text-gray-600" />
    )
  }

  return (
    <>
      <Head title="Manage Users" />

      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {flash?.success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {flash.success}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center">
                    ID
                    <SortIcon column="id" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center">
                    Name
                    <SortIcon column="name" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center">
                    Email
                    <SortIcon column="email" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Admin
                </th>
                <th
                  onClick={() => handleSort('created_at')}
                  className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
                >
                  <div className="flex items-center">
                    Created
                    <SortIcon column="created_at" />
                  </div>
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.data.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {u.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {u.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {u.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {u.is_admin ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    <div className="flex flex-col items-center space-y-2">
                      <Link
                        href={route('admin.users.edit', u.id)}
                        className="w-full text-center px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (
                            confirm('Are you sure you want to delete this user?')
                          ) {
                            Inertia.delete(route('admin.users.destroy', u.id), {
                              onSuccess: () => {},
                            })
                          }
                        }}
                        className="w-full text-center px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center space-x-2">
          {users.links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => link.url && Inertia.get(link.url, {}, { preserveState: true })}
              disabled={!link.url}
              className={`
                px-4 py-2 border rounded
                ${link.active
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'}
              `}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

UsersIndex.layout = (page) => (
  <AuthenticatedLayout>
    {page}
  </AuthenticatedLayout>
)