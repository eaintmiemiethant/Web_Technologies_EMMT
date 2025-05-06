// resources/js/Pages/Ebooks/Show.jsx

import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import MainLayout from "@/Layouts/MainLayout";
import { ShoppingCartIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function Show({ ebook }) {
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    Inertia.post(
      route("cart.store"),
      { ebook_id: ebook.id },
      {
        onSuccess: () => {
          setShowModal(true);
          setTimeout(() => setShowModal(false), 2000);
        },
      }
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href={route("browse")}
          className="inline-block mb-6 text-indigo-600 hover:text-indigo-800"
        >
          ← Back to catalog
        </Link>

        {/* Card */}
        <div className="mx-auto max-w-4xl bg-white/60 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cover */}
          <div className="p-6 flex items-center justify-center">
            {ebook.cover_image ? (
              <img
                src={ebook.cover_image}
                alt={ebook.title}
                className="w-full rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gray-200">
                <span className="text-gray-500">No Cover</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="col-span-2 p-6 flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {ebook.title || "Untitled"}
            </h1>
            <p className="text-gray-700 mb-4">
              <span className="font-medium">By:</span> {ebook.author || "Unknown"}
            </p>

            {ebook.description ? (
              <p className="mb-6 text-gray-800 leading-relaxed">{ebook.description}</p>
            ) : (
              <p className="mb-6 text-gray-500 italic">No description available.</p>
            )}

            {/* Price */}
            <p className="mb-6 text-xl font-bold text-indigo-700">
              {ebook.price === 0
                ? "Free"
                : `$${Number(ebook.price).toFixed(2)}`}
            </p>

            <div className="mt-auto flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Download if free */}
              {ebook.price === 0 && (
                <Link
                  href={route("ebooks.download", ebook.id)}
                  className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-white shadow hover:bg-indigo-700 transition"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download PDF
                </Link>
              )}

              {/* Add to cart */}
              {ebook.price > 0 && (
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-white shadow hover:bg-primary-dark transition"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-xl">
            <p className="mb-4 text-xl">🛒 Added to cart!</p>
            <button
              onClick={() => setShowModal(false)}
              className="rounded-full bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark transition"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </>
  );
}

Show.layout = (page) => <MainLayout>{page}</MainLayout>;
