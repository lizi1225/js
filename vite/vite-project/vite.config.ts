import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import autoprefixer from 'autoprefixer'
import windi from 'vite-plugin-windicss'


const variablePath = normalizePath(path.resolve('./src/variable.scss'))
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    babel: {
      // plugins: [
      //   'babel-plugin-styled-components',
      //   '@emotion/babel-plugin'
      // ]
    },
    // jsxImportSource: '@emotion/react',
  }), windi()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablePath}";`
      },
    },
    modules: {
      // name文件名 local类名 
      generateScopedName: "[name]__[local]__[hash:base64:10]"
    },
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
        })
      ]
    }
  }
})
