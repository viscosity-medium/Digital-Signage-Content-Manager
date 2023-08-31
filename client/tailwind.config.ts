import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {},
      colors: {
        folderColor: "#fcd462",
        activeItemColor: "#6567e9"
      }
    },
  },
  plugins: [],
}
export default config
