// resources/js/Pages/Browse.jsx
import React from 'react'
import { Inertia } from '@inertiajs/inertia'
import { router, Link, usePage } from '@inertiajs/react'   
import AppLayout from '@/Layouts/MainLayout'

export default function Browse({
  categories = [],
  ebooks = { data: [], links: [] },
  selectedCategory = '',
}) {
  function onCategoryChange(e) {
    router.get(
      route('browse'),                   
      { category: e.target.value },
      { preserveState: true }
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Browse e-Books</h1>

      {/* Category Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={onCategoryChange}
          className="w-full max-w-xs px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      {ebooks.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ebooks.data.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {book.cover_image && (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="h-48 w-full object-cover rounded mb-4"
                />
              )}
              <h2 className="font-semibold text-lg mb-1">{book.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{book.author}</p>
              <p className="font-bold text-primary mb-4">
                {Number(book.price) === 0
                  ? 'Free'
                  : `$${Number(book.price).toFixed(2)}`}
              </p>

              {/* use named route for the detail link */}
              <Link
                href={route('ebooks.show', book.id)}
                className="mt-auto text-center bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No books found.</p>
      )}

      {/* Pagination */}
      {ebooks.links.length > 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-2 overflow-x-auto">
            {ebooks.links.map((link, idx) => (
              <button
                key={idx}
                onClick={() =>
                  link.url &&
                  Inertia.get(link.url, {}, { preserveState: true })
                }
                disabled={!link.url}
                className={`
                  whitespace-nowrap px-3 py-1 border rounded
                  ${
                    link.active
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }
                  disabled:opacity-50
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

Browse.layout = (page) => <AppLayout>{page}</AppLayout>
