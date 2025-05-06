import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function UsersIndex() {
  const { users, flash } = usePage().props;

  return (
    <>
      <Head title="Manage Users" />

      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {flash.success && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {flash.success}
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            {['ID','Name','Email','Admin','Created','Actions'].map(h => (
              <th key={h} className="px-4 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.data.map(u => (
            <tr key={u.id} className="border-b">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.name}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.is_admin ? 'Yes':'No'}</td>
              <td className="px-4 py-2">{u.created_at}</td>
              <td className="px-4 py-2 space-x-2">
                <Link href={route('admin.users.edit', u.id)} className="text-blue-600 hover:underline">
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Delete this user?')) {
                      window.axios.delete(route('admin.users.destroy', u.id))
                        .then(() => location.reload());
                    }
                  }}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6">
        {users.links.map(link => (
          <Link
            key={link.url || link.label}
            href={link.url || ''}
            className={`mx-1 px-3 py-1 border rounded ${link.active ? 'bg-gray-800 text-white' : 'bg-white'}`}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </>
  );
}

UsersIndex.layout = page => <MainLayout>{page}</MainLayout>;