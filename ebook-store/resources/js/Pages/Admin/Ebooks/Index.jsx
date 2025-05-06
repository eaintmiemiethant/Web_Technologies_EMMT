import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

export default function EbooksIndex({ ebooks, sort, direction }) {
  // Helper to flip direction
  function nextDirection(column) {
    if (sort === column) {
      return direction === 'asc' ? 'desc' : 'asc';
    }
    return 'asc';
  }

  // Build a sort handler that Inertia.gets the page with updated query
  function handleSort(column) {
    Inertia.get(
      route('admin.ebooks.index'),
      { sort: column, direction: nextDirection(column) },
      { preserveState: true, replace: true }
    );
  }

  // Icon renderer
  function SortIcon({ column }) {
    if (sort !== column) return null;
    return direction === 'asc' ? (
      <ChevronUpIcon className="inline-block h-4 w-4 ml-1 text-gray-600" />
    ) : (
      <ChevronDownIcon className="inline-block h-4 w-4 ml-1 text-gray-600" />
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage E-Books</h1>
        <Link
          href={route('admin.ebooks.create')}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
        >
          + Add New
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              {/* ID Header */}
              <th
                onClick={() => handleSort('id')}
                className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  ID
                  <SortIcon column="id" />
                </div>
              </th>

              {/* Title Header */}
              <th
                onClick={() => handleSort('title')}
                className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  Title
                  <SortIcon column="title" />
                </div>
              </th>

              {/* Price Header */}
              <th
                onClick={() => handleSort('price')}
                className="cursor-pointer px-6 py-3 text-left text-sm font-medium text-gray-700"
              >
                <div className="flex items-center">
                  Price
                  <SortIcon column="price" />
                </div>
              </th>

              <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {ebooks.data.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {book.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {book.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  ${Number(book.price).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <div className="flex flex-col items-center space-y-2">
                    <Link
                      href={route('admin.ebooks.edit', book.id)}
                      className="w-full text-center px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            'Are you sure you want to delete this e-book?'
                          )
                        ) {
                          Inertia.delete(
                            route('admin.ebooks.destroy', book.id)
                          );
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
        {ebooks.links.map((link, idx) => (
          <button
            key={idx}
            onClick={() => link.url && Inertia.get(link.url)}
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
  );
}

EbooksIndex.layout = (page) => (
  <AuthenticatedLayout header={<h2 className="text-xl font-semibold">E-Book Catalog</h2>}>
    {page}
  </AuthenticatedLayout>
);