export interface InteractiveElement {
  tagName: string;
  textContent: string;
  id: number;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}