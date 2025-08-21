import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Dedicated UMD build that does not affect the main app build
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': '{}',
    'process': '{}',
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist-umd',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/umd/index.tsx'),
      name: 'Gamification',
      formats: ['umd'],
      fileName: () => 'gamification.umd.js',
    },
    sourcemap: false,
    rollupOptions: {
      // Do not bundle React, users will provide it from CDN
      external: ['react', 'react-dom'],
      output: {
        exports: 'default',
        // Deterministic asset names (e.g., CSS)
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) return 'gamification.css';
          return 'assets/[name][extname]';
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
