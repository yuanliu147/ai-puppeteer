import { imgUrlToImageElem } from '@/utils';
import { InteractiveElement } from './types';

export default async function highlightMarkedElements(interactiveElements: InteractiveElement[], image: string) {
  
  const imageElem = await imgUrlToImageElem(image);

  const canvas = document.createElement('canvas');

  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  canvas.width = viewportWidth;
  canvas.height = viewportHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2d context');
  }

  ctx.drawImage(imageElem, 0, 0, viewportWidth, viewportHeight);

  interactiveElements.forEach(element => {
    const { rect, id } = element;
    const { top, left, width, height } = rect;

    // Draw rectangle border
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(left, top, width, height);

    // Draw transparent background
    ctx.fillStyle = '#ff00001a';
    ctx.fillRect(left, top, width, height);

    // Draw ID tag
    const fontSize = 16;
    ctx.font = `bold ${fontSize}px Arial`;
    const text = id.toString();
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const padding = 4;
    const tagWidth = textWidth + padding * 2;
    const tagHeight = fontSize + padding * 2;

    // Draw tag background
    ctx.fillStyle = 'red';
    // Ensure the tag is drawn within the canvas boundaries
    let tagX = left;
    let tagY = top;
    
    // Optional: adjust tag position if it's better placed outside or inside
    // For now, let's place it at top-left corner.
    
    ctx.fillRect(tagX, tagY, tagWidth, tagHeight);

    // Draw tag text
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'top';
    ctx.fillText(text, tagX + padding, tagY + padding);
  });


  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

  return canvas.toDataURL();
}