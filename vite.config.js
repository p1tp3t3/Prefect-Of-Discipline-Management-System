import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    // FullCalendar's plugin packages use class-based exports that esbuild's
    // dependency pre-bundling mishandles (throws "Class constructor ...
    // cannot be invoked without 'new'") — excluding them from optimizeDeps
    // keeps them as real ES modules instead.
    optimizeDeps: {
        exclude: [
            '@fullcalendar/core',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/interaction',
            '@fullcalendar/react',
        ],
    },
});
