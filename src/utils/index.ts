export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function imgUrlToImageElem(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}