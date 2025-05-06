import React from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function UsersEdit() {
  const { user } = usePage().props;
  const { data, setData, patch, processing, errors } = useForm({
    name:     user.name,
    email:    user.email,
    is_admin: user.is_admin,
  });

  function submit(e) {
    e.preventDefault();
    patch(route('admin.users.update', user.id), {
      onSuccess: () => {
        // optionally flash or redirect
      },
    });
  }

  return (
    <>
      <Head title={`Edit User: ${user.name}`} />
      <form onSubmit={submit} className="max-w-md space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && <div className="text-red-600">{errors.name}</div>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.email && <div className="text-red-600">{errors.email}</div>}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={data.is_admin}
            onChange={e => setData('is_admin', e.target.checked)}
            className="mr-2"
          />
          <label>Administrator?</label>
        </div>
        <div className="flex space-x-4">
          <Link href={route('admin.users.index')} className="underline">
            Cancel
          </Link>
          <button
            disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}

UsersEdit.layout = page => <MainLayout>{page}</MainLayout>;