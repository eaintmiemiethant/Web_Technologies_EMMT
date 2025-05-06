import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreateEbook() {
  const { data, setData, post, processing, errors } = useForm({
    external_id:'', title:'', author:'', description:'', price:0, cover_image:'', file_path:'', category_id:''
  });

  function submit(e) {
    e.preventDefault();
    post(route('admin.ebooks.store'));
  }

  return (
    <>
      <Head title="Add E-Book" />

      <form onSubmit={submit} className="space-y-4 p-6 bg-white shadow rounded">
        { /* fields: title, author, price, etc.  */ }
        <div>
          <label>Title</label>
          <input
            type="text"
            value={data.title}
            onChange={e => setData('title', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && <div className="text-red-600">{errors.title}</div>}
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label>Author</label>
            <input
              type="text"
              value={data.author}
              onChange={e => setData('author', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.author && <div className="text-red-600">{errors.author}</div>}
          </div>
          <div className="w-32">
            <label>Price</label>
            <input
              type="number"
              value={data.price}
              onChange={e => setData('price', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {errors.price && <div className="text-red-600">{errors.price}</div>}
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={data.description}
            onChange={e => setData('description', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          {errors.description && <div className="text-red-600">{errors.description}</div>}
        </div>

        <div className="flex justify-end space-x-2">
          <button disabled={processing} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button type="submit" disabled={processing} className="px-4 py-2 bg-primary text-white rounded">
            Save
          </button>
        </div>
      </form>
    </>
  );
}

CreateEbook.layout = page => (
  <AuthenticatedLayout header={<h2 className="text-xl font-bold">Add New E-Book</h2>}>
    {page}
  </AuthenticatedLayout>
);
