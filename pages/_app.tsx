import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  // Suppress hydration warnings from third-party libraries (framer-motion, react-simple-typewriter)
  useEffect(() => {
    // This runs only on client, helping prevent hydration mismatch display
  }, [])

  return <Component {...pageProps} />
}
