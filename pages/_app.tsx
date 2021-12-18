import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fortawesome/fontawesome-svg-core/styles.css'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App
