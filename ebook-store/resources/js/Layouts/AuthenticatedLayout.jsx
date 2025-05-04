// resources/js/Layouts/AuthenticatedLayout.jsx
import React from 'react'
import MainLayout from './MainLayout'

export default function AuthenticatedLayout({ header, children }) {
  return (
    <MainLayout>
      {header && (
        <div className="bg-white shadow mb-6">
          <div className="container mx-auto px-6 py-4">{header}</div>
        </div>
      )}
      {children}
    </MainLayout>
  )
}
