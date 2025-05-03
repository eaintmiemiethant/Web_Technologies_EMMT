import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import AppLayout from '@/Layouts/AppLayout';

export default function Show({ ebook }) {
  return (
    <div className="container mx-auto p-6">
      <Link href={route('browse')} className="text-primary underline mb-4 inline-block">
        ← Back to browse
      </Link>
      <h1 className="text-4xl font-bold mb-2">{ebook.title}</h1>
      <p className="text-gray-600 mb-4">By {ebook.author}</p>
      <img src={ebook.cover_image} alt={ebook.title} className="w-1/3 rounded mb-4" />
      <p className="mb-4">{ebook.description}</p>
      <p className="font-bold text-lg mb-4">
        {ebook.price === 0 ? 'Free' : `$${Number(ebook.price).toFixed(2)}`}
      </p>
      <Link
        href={route('ebooks.download', ebook.id)}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Download PDF
      </Link>
    </div>
  );
}
Show.layout = page => <AppLayout>{page}</AppLayout>;