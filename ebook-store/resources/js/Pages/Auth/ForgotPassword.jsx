import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  function submit(e) {
    e.preventDefault();
    post(route('password.email'));
  }

  return (
    <>
      <Head title="Forgot Password" />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/">
              <img
                src="/storage/img/logo.png"
                alt="ByteBooks Logo"
                className="h-20"
              />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-center text-primary mb-4">
            Forgot Your Password?
          </h2>

          <p className="text-center text-gray-600 mb-6">
            No problem. Just enter your email and we’ll send you a password reset link.
          </p>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600 text-center">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${{
                  'border-red-500 focus:ring-red-400': errors.email,
                  'border-gray-300 focus:ring-primary': !errors.email,
                }['border-gray-300 focus:ring-primary']}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                Email Password Reset Link
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <Link href={route('login')} className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
