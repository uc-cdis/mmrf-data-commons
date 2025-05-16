import React from 'react';
import { Accordion, Table, ScrollArea } from '@mantine/core';

interface BarChartTextVersionProps {
  readonly data: {
    x: string[];
    y: number[];
    customdata: [number, number][];
    hovertemplate: string;
  }[];
}

const BarChartTextVersion: React.FC<BarChartTextVersionProps> = ({
  data,
}: BarChartTextVersionProps) => {
  const numberOfDecimalsPlacesToShow = 2;
  const maxHeightOfScrollArea = 300;

  const transformedData = data[0]?.x?.map((name: string, index: number) => ({
    name,
    value: data[0].y[index],
    customdata: data[0].customdata[index],
  }));

  const rows = transformedData.map((rowData) => (
    <Table.Tr key={rowData.name}>
      <Table.Td>{rowData.name}</Table.Td>
      <Table.Td>{rowData.value}</Table.Td>
      <Table.Td>
        {rowData.customdata[0]} / {rowData.customdata[1]} (
        {rowData.value.toFixed(numberOfDecimalsPlacesToShow)})%
      </Table.Td>
    </Table.Tr>
  ));

  const ChartTextVersionTable = (
    <ScrollArea h={maxHeightOfScrollArea}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Value</Table.Th>
            <Table.Th>Cases Affected</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );

  return (
    <Accordion>
      <Accordion.Item value="textVersion">
        <Accordion.Control>Text Version</Accordion.Control>
        <Accordion.Panel>{ChartTextVersionTable}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default BarChartTextVersion;
