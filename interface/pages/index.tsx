import * as Components from '../components';
import * as React from 'react';
import Head from 'next/head';

export default function Root() {
  const [file, setFile] = React.useState<File | undefined>();

  return (
    <div>
      <Head>
        <title>Cartographer</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Components.ImageSelector
        onFileSelected={(file) => {
          setFile(file);
        }}
      />

      {file ? <Components.SourceImage file={file} /> : null}
      <Components.ImageProcessor />
    </div>
  );
}
