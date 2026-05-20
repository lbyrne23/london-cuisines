import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠️  Change '/cuisine-tracker/' to match your GitHub repo name exactly
// e.g. if your repo is github.com/you/london-eats, use '/london-eats/'
export default defineConfig({
  plugins: [react()],
  base: '/london-cuisines/',
})
