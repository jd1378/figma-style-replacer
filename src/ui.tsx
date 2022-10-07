import {
  Button,
  Columns,
  Container,
  Dropdown,
  Bold,
  render,
  SegmentedControl,
  Text,
  VerticalSpace,
} from '@create-figma-plugin/ui';
import { emit, on } from '@create-figma-plugin/utilities';
import { h, JSX } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';

import {
  CloseHandler,
  GetStylesHandler,
  GetStylesResultHandler,
  ReplaceStyleHandler,
} from './types';

type StyleOption = {
  text: string;
  value: string;
};

const StyleTypesOptions = [
  {
    value: 'EFFECT',
  },
  {
    value: 'PAINT',
  },
  {
    value: 'TEXT',
  },
  {
    value: 'GRID',
  },
];

function Plugin() {
  const [selectedStyleType, setSelectedStyleType] =
    useState<StyleType>('EFFECT');
  const [findStyleId, setFindStyleId] = useState<string | null>(null);
  const [findStyleOptions, setFindStyleOptions] = useState<StyleOption[]>([]);
  const [replaceStyleId, setReplaceStyleId] = useState<string | null>(null);
  const [replaceStyleOptions, setReplaceStyleOptions] = useState<StyleOption[]>(
    [],
  );

  useEffect(() => {
    on<GetStylesResultHandler>('GET_STYLES_RESULT', (result) => {
      setFindStyleOptions(
        result.styles.map((style) => ({
          text: style.name,
          value: style.id,
        })),
      );
      setReplaceStyleOptions(
        result.styles.map((style) => ({
          text: style.name,
          value: style.id,
        })),
      );
    });
  }, []);

  useEffect(() => {
    setFindStyleId(null);
    setReplaceStyleId(null);
    emit<GetStylesHandler>('GET_STYLES', { type: selectedStyleType });
  }, [selectedStyleType]);

  const handleSearchAndSelectClick = useCallback(() => {
    if (findStyleId && replaceStyleId) {
      emit<ReplaceStyleHandler>('REPLACE_STYLE', {
        findStyleId,
        replaceStyleId,
      });
    }
  }, [findStyleId, replaceStyleId]);

  const handleCloseClick = useCallback(() => {
    emit<CloseHandler>('CLOSE');
  }, []);

  const handleFindStyleChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setFindStyleId(newValue);
    },
    [setFindStyleId],
  );

  const handleReplaceStyleChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setReplaceStyleId(newValue);
    },
    [setReplaceStyleId],
  );

  const handleSelectedStyleTypeChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setSelectedStyleType(newValue as StyleType);
    },
    [setSelectedStyleType],
  );

  return (
    <Container space="medium">
      <VerticalSpace space="small" />

      <Text style={{ fontWeight: 'medium' }}>Choose Style Type:</Text>

      <VerticalSpace space="small" />

      <SegmentedControl
        onChange={handleSelectedStyleTypeChange}
        options={StyleTypesOptions}
        value={selectedStyleType}
      />

      <VerticalSpace space="large" />

      <Text>
        <Bold>Find</Bold>:
      </Text>
      <VerticalSpace space="extraSmall" />
      <Dropdown
        variant="border"
        onChange={handleFindStyleChange}
        options={findStyleOptions}
        value={findStyleId}
        disabled={!findStyleOptions.length}
      />

      <VerticalSpace space="small" />

      <Text>
        <Bold>Replace</Bold>:
      </Text>
      <VerticalSpace space="extraSmall" />
      <Dropdown
        variant="border"
        onChange={handleReplaceStyleChange}
        options={replaceStyleOptions}
        value={replaceStyleId}
        disabled={!replaceStyleOptions.length}
      />

      <VerticalSpace space="medium" />

      <Columns space="extraSmall">
        <Button fullWidth onClick={handleSearchAndSelectClick}>
          Replace
        </Button>
        <Button fullWidth onClick={handleCloseClick} secondary>
          Close
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
