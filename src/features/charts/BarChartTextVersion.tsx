import React from 'react';
import { Accordion, Table } from '@mantine/core';
import { PlotData } from 'plotly.js';

export interface BarChartData {
  datasets: Partial<PlotData>[];
  yAxisTitle?: string;
  tickvals?: number[];
  ticktext?: string[];
  label_text?: string[] | number[];
  title?: string;
  filename?: string;
}

interface BarChartTextVersionProps {
  readonly data: BarChartData;
}

const BarChartTextVersion: React.FC<BarChartTextVersionProps> = ({
  data,
}: BarChartTextVersionProps) => {
  interface DataPoint {
    name: string;
    value: number;
  }

  const transformedData = data[0].x.map((name: string, index: number) => ({
    name,
    value: data[0].y[index],
    customdata: data[0].customdata[index],
  }));
  console.log('transformedData', transformedData);

  const rows = transformedData.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.value}</Table.Td>
      <Table.Td>
        {element.customdata[0]} / {element.customdata[1]} (
        {element.value.toFixed(2)})%
      </Table.Td>
    </Table.Tr>
  ));

  const ChartDataTable = (
    <>
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
    </>
  );

  return (
    <>
      <Accordion>
        <Accordion.Item value="textVersion">
          <Accordion.Control>{`Text Version`}</Accordion.Control>
          <Accordion.Panel>{ChartDataTable}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default BarChartTextVersion;
