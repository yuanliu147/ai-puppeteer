import { contextBridge } from 'electron';


import markInteractiveElements from './tools/markInteractiveElements';
import highlightMarkedElements from './tools/highlightMarkedElements';

contextBridge.exposeInMainWorld('aiOperator', {
  markInteractiveElements,
  highlightMarkedElements,
});
