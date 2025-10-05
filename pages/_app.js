import '@/styles/globals.css'
import Intro from '@/components/Intro'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Intro />
      <Component {...pageProps} />
    </>
  )
}
