import { MoralisProvider } from 'react-moralis'
import { RobinhoodProvider } from '../context/RobinhoodContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
    serverUrl='https://rswdm5wclrrt.usemoralis.com:2053/server'
    appId='8l4UWUSwsTo6oRpWtqTXU0Qd5k60HOUBc1odweCt'
    >

    <RobinhoodProvider>
  <Component {...pageProps} />
  </RobinhoodProvider>
    </MoralisProvider>
  )
}

export default MyApp
