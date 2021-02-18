import * as Components from '../components';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Cartographer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Components.ImageProcessor />
    </div>
  );
}
