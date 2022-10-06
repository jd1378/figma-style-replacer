import {
  Button,
  Columns,
  Container,
  Dropdown,
  Muted,
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
  const [fromStyleId, setFromStyleId] = useState<string | null>(null);
  const [fromStyleOptions, setFromStyleOptions] = useState<StyleOption[]>([]);
  const [toStyleId, setToStyleId] = useState<string | null>(null);
  const [toStyleOptions, setToStyleOptions] = useState<StyleOption[]>([]);

  useEffect(() => {
    on<GetStylesResultHandler>('GET_STYLES_RESULT', (result) => {
      setFromStyleOptions(
        result.styles.map((style) => ({
          text: style.name,
          value: style.id,
        })),
      );
      setToStyleOptions(
        result.styles.map((style) => ({
          text: style.name,
          value: style.id,
        })),
      );
    });
  }, []);

  useEffect(() => {
    setFromStyleId(null);
    setToStyleId(null);
    emit<GetStylesHandler>('GET_STYLES', { type: selectedStyleType });
  }, [selectedStyleType]);

  const handleSearchAndSelectClick = useCallback(() => {
    if (fromStyleId && toStyleId) {
      emit<ReplaceStyleHandler>('REPLACE_STYLE', { fromStyleId, toStyleId });
    }
  }, [fromStyleId, toStyleId]);

  const handleCloseClick = useCallback(() => {
    emit<CloseHandler>('CLOSE');
  }, []);

  const handleFromStyleChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setFromStyleId(newValue);
    },
    [setFromStyleId],
  );

  const handleToStyleChange = useCallback(
    (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setToStyleId(newValue);
    },
    [setToStyleId],
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
      <SegmentedControl
        onChange={handleSelectedStyleTypeChange}
        options={StyleTypesOptions}
        value={selectedStyleType}
      />
      <VerticalSpace space="small" />
      <Text>
        <Muted>Style to copy from:</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Dropdown
        onChange={handleFromStyleChange}
        options={fromStyleOptions}
        value={fromStyleId}
        disabled={!fromStyleOptions.length}
      />

      <VerticalSpace space="small" />
      <Text>
        <Muted>Style to copy to:</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Dropdown
        onChange={handleToStyleChange}
        options={toStyleOptions}
        value={toStyleId}
        disabled={!toStyleOptions.length}
      />

      <VerticalSpace space="extraLarge" />
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
