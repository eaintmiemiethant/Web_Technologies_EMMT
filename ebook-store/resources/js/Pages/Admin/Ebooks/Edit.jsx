// resources/js/Pages/Admin/Ebooks/Edit.jsx
import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function EbooksEdit() {
  const { ebook } = usePage().props;

  const { data, setData, patch, processing, errors } = useForm({
    title:       ebook.title,
    author:      ebook.author,
    price:       ebook.price,
    description: ebook.description || '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    patch(route('admin.ebooks.update', ebook.id), {
      onSuccess: () => {
        // you can trigger a toast or flash
      },
    });
  }

  return (
    <>
      <Head title={`Edit E-Book: ${ebook.title}`} />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-100">
        <div className="w-full max-w-lg glassmorphism p-8 rounded-xl shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Edit E-Book
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-30 placeholder-gray-400 focus:bg-opacity-60 focus:outline-none ${
                  errors.title ? 'border-red-500' : 'border-transparent'
                }`}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                id="author"
                type="text"
                value={data.author}
                onChange={(e) => setData('author', e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-30 placeholder-gray-400 focus:bg-opacity-60 focus:outline-none ${
                  errors.author ? 'border-red-500' : 'border-transparent'
                }`}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => setData('price', e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-30 placeholder-gray-400 focus:bg-opacity-60 focus:outline-none ${
                  errors.price ? 'border-red-500' : 'border-transparent'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className={`w-full px-4 py-2 rounded-md bg-white bg-opacity-30 placeholder-gray-400 focus:bg-opacity-60 focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-transparent'
                }`}
                placeholder="A brief synopsis of the book…"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-300/50">
              <Link
                href={route('admin.ebooks.index')}
                className="text-sm font-medium text-primary hover:underline"
              >
                ← Back to Catalog
              </Link>

              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark disabled:opacity-50 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

EbooksEdit.layout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);
