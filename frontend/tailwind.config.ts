import {Config} from "tailwindcss";

const config: Config = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      screens: {
        xs: { raw: '(max-width: 640px)' },
      }
    },
  },
  plugins: [],
  corePlugins:{
    container: false,
  }
}

export default config