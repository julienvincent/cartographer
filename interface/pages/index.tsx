import * as Components from '../components';
import * as React from 'react';
import Head from 'next/head';

export default function Root() {
  const [file, setFile] = React.useState<File>();
  const [image_data, setImageData] = React.useState<ImageData>();

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

      {file ? (
        <Components.SourceImage file={file} onImageDataChange={setImageData} />
      ) : null}

      {image_data ? (
        <Components.ImagePreview
          image_data={image_data}
          scale={Components.MAP_SCALE.X1}
        />
      ) : null}

      <Components.ImageProcessor />
    </div>
  );
}
