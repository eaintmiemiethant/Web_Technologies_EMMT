import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <>
      <Head title="Register" />

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

          <h2 className="text-2xl font-bold text-center text-primary mb-6">
            Create Your Account
          </h2>

          <form onSubmit={submit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${{
                  'border-red-500 focus:ring-red-400': errors.name,
                  'border-gray-300 focus:ring-primary': !errors.name,
                }['border-gray-300 focus:ring-primary']}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${{
                  'border-red-500 focus:ring-red-400': errors.email,
                  'border-gray-300 focus:ring-primary': !errors.email,
                }['border-gray-300 focus:ring-primary']}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${{
                  'border-red-500 focus:ring-red-400': errors.password,
                  'border-gray-300 focus:ring-primary': !errors.password,
                }['border-gray-300 focus:ring-primary']}`}
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${{
                  'border-red-500 focus:ring-red-400': errors.password_confirmation,
                  'border-gray-300 focus:ring-primary': !errors.password_confirmation,
                }['border-gray-300 focus:ring-primary']}`}
              />
              {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={processing}
                className="w-full flex justify-center py-2 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                Register
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-400">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Already registered */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href={route('login')} className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
