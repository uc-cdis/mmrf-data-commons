import React, { useState } from "react";
import { Tooltip, Box } from "@mantine/core";
import {
  LineSegment,
  VictoryAxis,
  VictoryBoxPlot,
  VictoryChart,
  VictoryLabel,
  VictoryLabelProps,
  VictoryScatter,
  Box as VictoryBox,
  BoxProps,
  VictoryContainer,
} from "victory";
import tailwindConfig from "tailwind.config";

const CustomQ1 = (props: BoxProps) => {
  // Provide default values for potentially undefined properties
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const width = props.width ?? 0;
  const height = props.height ?? 0;

  return (
    <>
      <VictoryBox {...props} />
      <LineSegment
        x1={x}
        y1={y + height}
        x2={x + width}
        y2={y + height}
        style={{ strokeWidth: 1.5 }}
      />
    </>
  );
};

const CustomQ3 = (props: BoxProps) => {
  // Provide default values for potentially undefined properties
  const x = props.x ?? 0;
  const y = props.y ?? 0;
  const width = props.width ?? 0;

  return (
    <>
      <VictoryBox {...props} />
      <LineSegment
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        style={{ strokeWidth: 1.5 }}
      />
    </>
  );
};

interface BoxPlotTooltipProps {
  readonly visible: boolean;
  readonly x?: number;
  readonly y?: number;
  readonly text?: string;
}

const BoxPlotTooltip: React.FC<BoxPlotTooltipProps> = ({
                                                         x,
                                                         y,
                                                         text,
                                                         visible,
                                                       }: BoxPlotTooltipProps) => {
  return visible ? (
    <g style={{ pointerEvents: "none" }}>
      <foreignObject x={x} y={y}>
        <Tooltip label={text} withArrow opened withinPortal>
          <Box />
        </Tooltip>
      </foreignObject>
    </g>
  ) : null;
};

interface BoxPlotProps {
  readonly data: {
    readonly min: number;
    readonly max: number;
    readonly median: number;
    readonly mean: number;
    readonly q1: number;
    readonly q3: number;
  };
  readonly field: string;
  readonly color: string;
  readonly height: number;
  readonly width: number;
  readonly chartPadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  readonly chartRef?: React.MutableRefObject<HTMLElement>;
  readonly label?: string[];
}

const BoxPlot: React.FC<BoxPlotProps> = ({
                                           data,
                                           field,
                                           color,
                                           height,
                                           width,
                                           chartPadding = { left: 60, right: 20, bottom: 40, top: 50 },
                                           chartRef,
                                           label = ["Box Plot"],
                                         }: BoxPlotProps) => {
  const [tooltipProps, setShowTooltipProps] = useState<{
    visible: boolean;
    x?: number;
    y?: number;
    text?: string;
  }>({
    visible: false,
  });

  const emptyChart = Object.values(data).every((val) => val === 0);

  // Provide default values for potentially undefined chartPadding properties
  const paddingLeft = chartPadding.left ?? 60;
  const paddingRight = chartPadding.right ?? 20;

  return (
    <VictoryChart
      height={height}
      width={width}
      padding={chartPadding}
      minDomain={{ x: 1, y: data.min }}
      maxDomain={{ x: 1, y: data.max }}
      containerComponent={
        <VictoryContainer
          containerRef={
            chartRef
              ? (ref: HTMLElement | null) => {
                if (ref) chartRef.current = ref;
              }
              : undefined
          }
          aria-label={`This Box Plot visualizes the distribution of ${field} values. Refer to the accompanying Statistics table or download the TSV file for details.`}
        />
      }
    >
      <VictoryLabel
        dy={20}
        dx={(width + paddingLeft - paddingRight) / 2}
        text={label}
        style={{ fontSize: 16, fontFamily: "Noto Sans" }}
        textAnchor="middle"
      />
      <VictoryAxis
        dependentAxis
        style={{
          grid: {
            stroke: tailwindConfig.theme.extend.colors["gdc-grey"].lighter,
            strokeWidth: 1,
          },
        }}
        crossAxis={false}
        tickCount={8}
        tickLabelComponent={emptyChart ? <></> : undefined}
        tickFormat={(value: number) =>
          value.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            notation: "compact",
            compactDisplay: "short",
          })
        }
      />
      <VictoryBoxPlot
        style={{
          q1: { fill: color },
          q3: { fill: color },
          min: { strokeWidth: 1.5 },
          max: { strokeWidth: 1.5 },
          median: { strokeWidth: 1.5 },
        }}
        boxWidth={40}
        minLabelComponent={<></>}
        maxLabelComponent={<></>}
        q1LabelComponent={<></>}
        q3LabelComponent={<></>}
        medianLabelComponent={<></>}
        q1Component={<CustomQ1 />}
        q3Component={<CustomQ3 />}
        data={[
          {
            x: 1,
            min: data.min,
            median: data.median,
            max: data.max,
            q1: data.q1,
            q3: data.q3,
            mean: data.mean,
          },
        ]}
        events={[
          {
            target: "min",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "minLabels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Minimum: ${data.min.toLocaleString()}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "max",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "maxLabels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Maximum: ${data.max.toLocaleString()}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "median",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "medianLabels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Median: ${data.median.toLocaleString()}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "q1",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "q1Labels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Q1: ${data.q1.toLocaleString()}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
          {
            target: "q3",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "q3Labels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Q3: ${data.q3.toLocaleString()}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
        ]}
        labels
      />
      <VictoryScatter
        data={[{ y: data.mean, x: 1 }]}
        style={{
          data: {
            fill: "white",
            stroke: tailwindConfig.theme.extend.colors["gdc-grey"].lighter,
            strokeWidth: 1.5,
          },
        }}
        size={5}
        symbol={"plus"}
        labels={() => ""}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "labels",
                    mutation: (labelProps: VictoryLabelProps) => {
                      setShowTooltipProps({
                        visible: true,
                        x: labelProps?.x,
                        y: labelProps?.y,
                        text: `Mean: ${data.mean.toLocaleString()}`,
                      });
                    },
                  },
                ];
              },
              onMouseOut: () => {
                setShowTooltipProps({ visible: false });
              },
            },
          },
        ]}
      />
      <BoxPlotTooltip {...tooltipProps} />
    </VictoryChart>
  );
};

export default BoxPlot;
