import React from 'react';
import { Accordion, Table, ScrollArea } from '@mantine/core';
import isNumber from 'lodash/isNumber';

interface BarChartTextVersionProps {
  readonly data: any[];
}

const BarChartTextVersion: React.FC<BarChartTextVersionProps> = ({
  data,
}: BarChartTextVersionProps) => {
  const maxHeightOfScrollArea = 300;
  const numberOfDecimalsPlacesToShow = 2;
  const formatNumber = (num: number) =>
    num
      .toFixed(numberOfDecimalsPlacesToShow)
      .replace(/\.00$/, '')
      .replace(/\.0$/, '');

  const headerTitles = Object.keys(data[0]);

  const rows = data.map((rowData) => {
    const rowDataArr = Object.values(rowData);
    return (
      <Table.Tr key={rowData.name}>
        {rowDataArr.map((value, i) => (
          <Table.Td key={i}>
            {isNumber(value) ? formatNumber(value) : (value as string)}
          </Table.Td>
        ))}
      </Table.Tr>
    );
  });

  const TextVersionTable = (
    <div data-testid="chart-text-version">
      <ScrollArea h={maxHeightOfScrollArea}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {headerTitles.map((title, i) => (
                <Table.Th key={i} className="capitalize">
                  {title}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  );

  return (
    <Accordion>
      <Accordion.Item value="textVersion">
        <Accordion.Control>Text Version</Accordion.Control>
        <Accordion.Panel>{TextVersionTable}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default BarChartTextVersion;
