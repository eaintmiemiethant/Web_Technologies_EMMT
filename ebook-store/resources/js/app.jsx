import '../css/app.css';
import './bootstrap';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import MainLayout from '@/Layouts/MainLayout';

createInertiaApp({
    title: (title) => `${title} - ${import.meta.env.VITE_APP_NAME || 'Laravel'}`,
    resolve: (name) => {
      const pages = import.meta.glob('./Pages/**/*.jsx');
      return resolvePageComponent(`./Pages/${name}.jsx`, pages).then((module) => {
        if (!module.default.layout) {
          module.default.layout = (page, props) => (
            <MainLayout auth={props.auth}>{page}</MainLayout>
          );
        }
        return module;
      });
    },
    setup({ el, App, props }) {
      const root = createRoot(el);
      root.render(<App {...props} />);
    },
    progress: { color: '#4B5563' },
  });