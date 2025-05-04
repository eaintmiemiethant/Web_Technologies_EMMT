// resources/js/Pages/Ebooks/Show.jsx
import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';
import AppLayout from '@/Layouts/MainLayout';

export default function Show({ ebook }) {
  const [showModal, setShowModal] = useState(false);

  function handleAddToCart() {
    Inertia.post(
      route('cart.store'),
      { ebook_id: ebook.id },
      {
        onSuccess: () => {
          setShowModal(true);
          // auto-dismiss after 2s
          setTimeout(() => setShowModal(false), 2000);
        },
      }
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <Link
          href={route('browse')}
          className="text-primary underline mb-4 inline-block"
        >
          ← Back to browse
        </Link>

        <h1 className="text-4xl font-bold mb-2">{ebook.title}</h1>
        <p className="text-gray-600 mb-4">By {ebook.author}</p>

        {ebook.cover_image && (
          <img
            src={ebook.cover_image}
            alt={ebook.title}
            className="w-1/3 rounded mb-4"
          />
        )}

        {ebook.description && <p className="mb-4">{ebook.description}</p>}

        <p className="font-bold text-lg mb-4">
          {ebook.price === 0
            ? 'Free'
            : `$${Number(ebook.price).toFixed(2)}`}
        </p>

        {/* Download PDF */}
        <Link
          href={route('ebooks.download', ebook.id)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark mr-4"
        >
          Download PDF
        </Link>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add to Cart
        </button>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <p className="text-xl mb-4">🛒 Added to cart!</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </>
  );
}

Show.layout = page => <AppLayout>{page}</AppLayout>;
