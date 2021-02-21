export const extractImageDataFromFile = (file: File) => {
  const image = new Image();

  return new Promise<ImageData>((resolve) => {
    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0, width, height);
      resolve(context.getImageData(0, 0, width, height));
    };

    image.src = URL.createObjectURL(file);
  });
};

export const download = (data: Uint8Array, file_name: string) => {
  const data_url = URL.createObjectURL(
    new Blob([data], {
      type: 'application/octet-stream'
    })
  );

  const a = document.createElement('a') as HTMLAnchorElement;
  a.setAttribute('href', data_url);
  a.setAttribute('style', 'display: none');
  a.setAttribute('download', file_name);

  document.body.appendChild(a);

  a.click();
  a.remove();
};
