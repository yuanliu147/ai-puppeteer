function getAllInteractiveElements() {
  return document.querySelectorAll<HTMLElement>('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');
}



export default function markInteractiveElements() {
  const interactiveElements = getAllInteractiveElements();
  // interactiveElements.forEach((element) => {
  //   element.style.outline = '2px solid red';
  // });
  console.log('markInteractiveElements', document);
  return Array.from(interactiveElements).map((item, index) => {
    const tagName = item.tagName.toLowerCase();
    const rect = item.getBoundingClientRect();

    const textContent = ['input', 'textarea', 'select'].includes(tagName) ? item.value?.trim() || '' : item.textContent?.trim() || '';

    return {
      tagName,
      textContent,
      id: index,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
    };

  }).filter((item) => item.rect.width > 0 && item.rect.height > 0);
}