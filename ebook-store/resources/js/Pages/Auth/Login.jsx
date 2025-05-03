import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), { onFinish: () => reset('password') });
  };

  return (
    <>
      <Head title="Log in" />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/">
              <img
                src="/storage/img/logo.png"
                alt="ByteBooks Logo"
                className="h-30"
              />
            </Link>
          </div>

          {status && (
            <div className="mb-4 text-sm font-medium text-green-600">
              {status}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-primary'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-primary'
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>

              {canResetPassword && (
                <Link
                  href={route('password.request')}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                Log in
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link
              href={route('register')}
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
Login.layout = page => <AppLayout>{page}</AppLayout>;
