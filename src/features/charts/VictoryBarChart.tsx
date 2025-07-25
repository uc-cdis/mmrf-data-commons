import React, { useState } from "react";
import { truncateString } from "@/utils/index";
import { Box, Tooltip } from "@mantine/core";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryLabelProps,
  VictoryTooltip,
  Bar,
  VictoryContainer,
} from "victory";

interface BarChartTooltipProps {
  readonly x?: number;
  readonly y?: number;
  readonly datum?: any;
}

const BarChartTooltip: React.FC<BarChartTooltipProps> = ({
  x,
  y,
  datum,
}: BarChartTooltipProps) => {
  return (
    <g style={{ pointerEvents: "none" }}>
      <foreignObject x={x} y={y}>
        <Tooltip
          label={
            <>
              {datum?.fullName}: {datum?.yCount.toLocaleString()} (
              {(datum?.yCount / datum?.yTotal).toLocaleString(undefined, {
                style: "percent",
                minimumFractionDigits: 2,
              })}
              )
            </>
          }
          withArrow
          opened
          withinPortal
        >
          <Box />
        </Tooltip>
      </foreignObject>
    </g>
  );
};

const BarChartLabel: React.FC<
  VictoryLabelProps & { index?: number; truncateLabels?: boolean }
> = ({
  x,
  y,
  style,
  angle,
  data,
  index,
  truncateLabels,
}: VictoryLabelProps & { index?: number; truncateLabels?: boolean }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const label = data?.[index ?? 0]?.fullName || "";

  // Early return if essential values are undefined
  if (x === undefined || y === undefined) {
    return null;
  }

  return (
    <g>
      <text
        x={x}
        y={y}
        textAnchor="start"
        transform={`rotate(${angle},${x - 5}, ${y})`}
        style={style as Record<string, string>}
        onMouseOver={() => setShowTooltip(true)}
        onMouseOut={() => setShowTooltip(false)}
      >
        {truncateLabels ? truncateString(label, 8) : label}
      </text>
      {showTooltip && data && index !== undefined &&
        (
        <BarChartTooltip x={x + 20} y={y - 20} datum={data[index]} />
      )}
    </g>
  );
};

interface VictoryBarChartProps {
  readonly data: any;
  readonly title?: string;
  readonly color: string;
  readonly yLabel?: string;
  readonly xLabel?: string;
  readonly chartLabel?: string;
  readonly width?: number;
  readonly height?: number;
  readonly chartPadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  readonly hideYTicks?: boolean;
  readonly hideXTicks?: boolean;
  readonly yAxisFormatAsInteger?: boolean;
  readonly chartRef?: React.MutableRefObject<HTMLElement>;
  readonly truncateLabels?: boolean;
}

const VictoryBarChart: React.FC<VictoryBarChartProps> = ({
  data,
  title,
  color,
  yLabel,
  xLabel,
  chartLabel,
  width = 400,
  height = 400,
  chartPadding,
  hideYTicks = false,
  hideXTicks = false,
  yAxisFormatAsInteger = false,
  chartRef = undefined,
  truncateLabels = false,
}: VictoryBarChartProps) => {
  const padding = chartPadding ?? { left: 130, right: 80, bottom: 80, top: 10 };

  return (
    <VictoryChart
      title={title}
      width={width}
      height={height}
      domainPadding={60}
      padding={padding}
      containerComponent={
        <VictoryContainer
          containerRef={
            chartRef
              ? (ref: HTMLElement | null) => {
                  if (ref) chartRef.current = ref;
                }
              : undefined
          }
          role="figure"
        />
      }
    >
      {chartLabel && (
        <VictoryLabel
          dy={20}
          dx={(width + (padding.left ?? 0) - (padding.right ?? 0)) / 2}
          text={chartLabel}
          textAnchor="middle"
          style={{ fontSize: 28, fontFamily: "Noto Sans" }}
        />
      )}
      <VictoryAxis
        dependentAxis
        label={yLabel}
        axisLabelComponent={<VictoryLabel dy={-70} />}
        tickLabelComponent={hideYTicks ? <></> : undefined}
        style={{
          tickLabels: { fontSize: 25, fontFamily: "Noto Sans" },
          grid: { stroke: "#F5F5F5", strokeWidth: 1 },
          axisLabel: { fontSize: 25, fontFamily: "Noto Sans" },
        }}
        tickFormat={
          yAxisFormatAsInteger
            ? (t: any) => (Number.isInteger(t) ? t.toLocaleString() : null)
            : undefined
        }
      />
      <VictoryAxis
        style={{
          tickLabels: { angle: 45, fontSize: 25, fontFamily: "Noto Sans" },
          axisLabel: { fontSize: 25, fontFamily: "Noto Sans" },
        }}
        tickLabelComponent={
          hideXTicks ? (
            <></>
          ) : (
            <BarChartLabel data={data} truncateLabels={truncateLabels} />
          )
        }
        label={xLabel}
      />
      <VictoryBar
        data={data}
        style={{ data: { fill: color }, labels: { fontFamily: "Noto Sans" } }}
        labels={() => ""}
        labelComponent={
          <VictoryTooltip flyoutComponent={<BarChartTooltip />} />
        }
        domain={data.length <= 2 ? { x: [0, 5] } : undefined}
        barWidth={data.length === 1 ? 100 : undefined}
        dataComponent={
          <Bar
            tabIndex={0}
            ariaLabel={({ datum }) => `x: ${datum.x}, y: ${datum.y}`}
            //  https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/756 https://www.w3.org/TR/graphics-aria-1.0/#graphics-symbol
            // eslint-disable-next-line
            role="graphics-symbol"
          />
        }
      />
    </VictoryChart>
  );
};

export default VictoryBarChart;
