import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  return (
    <AuthenticatedLayout header={<h2>Dashboard</h2>}>
      <Head title="Dashboard" />
      <p>You're logged in!</p>
    </AuthenticatedLayout>
  )
}

Dashboard.layout = page => page;
