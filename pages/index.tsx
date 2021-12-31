import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { NextPage } from 'next'
import Layout from '../components/layout'

const Home: NextPage = () => {
  return (
    <Layout>
      <p className="my-6 mt-12">
        The Shabbaton Choir was formed in 1990 out of the B&apos;nei Brith Festival Singers (which itself was formed in 1986).  Stephen Levey was conductor and Musical Director from 1991 to 2020 before becoming Conductor Laureate. The current Musical Director is Benjamin Fingerhut. The Choir’s innovative choral sound has been heard in synagogue services and concerts throughout the United Kingdom and abroad. The harmonies and arrangements are written with the aim of bringing out clearly the mood and meaning of the words.
      </p>
      <p className="my-6">
        The main aims of the Choir are to advance Judaism and in particular Jewish Prayer, through participation in synagogue service; singing at public performances, and in television and radio broadcasts, recordings and through other media.
      </p>
      <p className="my-6">
        The Shabbaton Choir is a registered charity, registered in England and Wales under Number 1058256. To send a donation, please click on the button below.
      </p>

      <a href="https://www.paypal.com/uk/fundraiser/charity/2717196" className="no-underline" target="_blank" rel="noreferrer">
        <div className="flex w-fit mx-auto items-center rounded-full my-2 bg-primary-500 hover:bg-primary-300 text-white px-4 py-2 text-sm">
          <FontAwesomeIcon size="2x" icon={faPaypal} />
          &ensp;
          <span>Donate</span>
        </div>
      </a>

      <p className="my-12" />
    </Layout>
  );
}

export default Home
