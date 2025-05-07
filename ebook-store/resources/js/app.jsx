// resources/js/app.jsx
import '../css/app.css'
import './bootstrap'

import React from 'react'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

import MainLayout from '@/Layouts/MainLayout'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
  // Title builder
  title: (title) => (title ? `${title} - ${appName}` : appName),

  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx')
    return resolvePageComponent(`./Pages/${name}.jsx`, pages).then((module) => {
      if (!module.default.layout) {
        module.default.layout = (page, props) => (
          <MainLayout auth={props.auth}>{page}</MainLayout>
        )
      }
      return module
    })
  },

  // Mount/react entrypoint
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(<App {...props} />)
  },

  // Progress indicator color
  progress: {
    color: '#4B5563',
  },
})