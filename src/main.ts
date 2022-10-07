import { once, emit, showUI, on } from '@create-figma-plugin/utilities';

import {
  CloseHandler,
  GetStylesHandler,
  GetStylesResult,
  GetStylesResultHandler,
  ReplaceOptions,
  ReplaceStyleHandler,
} from './types';

export default () => {
  on<ReplaceStyleHandler>('REPLACE_STYLE', (replaceOptions: ReplaceOptions) => {
    const { findStyleId, replaceStyleId } = replaceOptions;
    const foundStyle = figma.getStyleById(findStyleId);
    const replacedStyle = figma.getStyleById(replaceStyleId);
    if (foundStyle && replacedStyle) {
      // found style and replacedStyle are always the same type, so we don't check anymore

      // findAll serves as a traversal tool, we use it with side effects to not write 2 loops
      /* eslint-disable no-param-reassign */
      figma.currentPage.findAll((node: SceneNode) => {
        if ((node as ComponentNode).fillStyleId === findStyleId) {
          (node as ComponentNode).fillStyleId = replaceStyleId;
        }
        if ((node as ComponentNode).strokeStyleId === findStyleId) {
          (node as ComponentNode).strokeStyleId = replaceStyleId;
        }
        if ((node as ComponentNode).gridStyleId === findStyleId) {
          (node as ComponentNode).gridStyleId = replaceStyleId;
        }
        if ((node as ComponentNode).effectStyleId === findStyleId) {
          (node as ComponentNode).effectStyleId = replaceStyleId;
        }
        if ((node as ComponentNode).backgroundStyleId === findStyleId) {
          (node as ComponentNode).backgroundStyleId = replaceStyleId;
        }
        if ((node as ComponentNode).backgroundStyleId === findStyleId) {
          (node as ComponentNode).backgroundStyleId = replaceStyleId;
        }
        if ((node as TextNode).textStyleId === findStyleId) {
          (node as TextNode).textStyleId = replaceStyleId;
        }
        return false;
      });
      /* eslint-enable no-param-reassign */
    }
  });
  on<GetStylesHandler>('GET_STYLES', (options) => {
    const { type } = options;
    let styles: GetStylesResult['styles'] = [];
    if (type === 'EFFECT') {
      styles = figma.getLocalEffectStyles();
    } else if (type === 'GRID') {
      styles = figma.getLocalGridStyles();
    } else if (type === 'PAINT') {
      styles = figma.getLocalPaintStyles();
    } else if (type === 'TEXT') {
      styles = figma.getLocalTextStyles();
    }
    styles = styles.map((s) => ({
      id: s.id,
      name: s.name,
    }));
    emit<GetStylesResultHandler>('GET_STYLES_RESULT', {
      type,
      styles,
    });
  });
  once<CloseHandler>('CLOSE', () => {
    figma.closePlugin();
  });
  showUI({
    height: 245,
    width: 250,
  });
};
