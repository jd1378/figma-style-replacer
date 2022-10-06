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
    const { fromStyleId, toStyleId } = replaceOptions;
    const fromStyle = figma.getStyleById(fromStyleId);
    const toStyle = figma.getStyleById(toStyleId);
    if (
      fromStyle &&
      toStyle &&
      fromStyle.type === toStyle.type &&
      !toStyle.remote
    ) {
      toStyle.description = fromStyle.description;
      if (fromStyle.type === 'EFFECT') {
        (toStyle as EffectStyle).effects = (fromStyle as EffectStyle).effects;
      } else if (fromStyle.type === 'GRID') {
        (toStyle as GridStyle).layoutGrids = (
          fromStyle as GridStyle
        ).layoutGrids;
      } else if (fromStyle.type === 'PAINT') {
        (toStyle as PaintStyle).paints = (fromStyle as PaintStyle).paints;
      } else if (fromStyle.type === 'TEXT') {
        (toStyle as TextStyle).fontName = (fromStyle as TextStyle).fontName;
        (toStyle as TextStyle).fontSize = (fromStyle as TextStyle).fontSize;
        (toStyle as TextStyle).letterSpacing = (
          fromStyle as TextStyle
        ).letterSpacing;
        (toStyle as TextStyle).lineHeight = (fromStyle as TextStyle).lineHeight;
        (toStyle as TextStyle).paragraphIndent = (
          fromStyle as TextStyle
        ).paragraphIndent;
        (toStyle as TextStyle).paragraphSpacing = (
          fromStyle as TextStyle
        ).paragraphSpacing;
        (toStyle as TextStyle).textCase = (fromStyle as TextStyle).textCase;
        (toStyle as TextStyle).textDecoration = (
          fromStyle as TextStyle
        ).textDecoration;
      }
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
    height: 230,
    width: 250,
  });
};
