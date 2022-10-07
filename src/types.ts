import { EventHandler } from '@create-figma-plugin/utilities';

export type GetStyleOptions = {
  type: StyleType;
};

export interface GetStylesHandler extends EventHandler {
  name: 'GET_STYLES';
  handler: (options: GetStyleOptions) => void;
}

export type GetStylesResult = {
  type: StyleType;
  styles: Array<{
    id: string;
    name: string;
  }>;
};

export interface GetStylesResultHandler extends EventHandler {
  name: 'GET_STYLES_RESULT';
  handler: (result: GetStylesResult) => void;
}

export type ReplaceOptions = {
  findStyleId: string;
  replaceStyleId: string;
};

export interface ReplaceStyleHandler extends EventHandler {
  name: 'REPLACE_STYLE';
  handler: (options: ReplaceOptions) => void;
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE';
  handler: () => void;
}
