import React, { useEffect, useState, useRef } from "react";
import { init, EChartsOption, ECharts, getInstanceByDom } from "echarts";
import { useDeepCompareEffect } from "use-deep-compare";
import { useResizeObserver } from '@mantine/hooks';

export interface EChartWrapperResponsiveProps {
  readonly option: EChartsOption;
  readonly style?: React.CSSProperties;
  readonly onDimensionsChange?: (dimensions: {
    width: number;
    height: number;
  }) => void;
}

const EChartWrapperResponsive: React.FC<EChartWrapperResponsiveProps> = ({
  option,
  style,
  onDimensionsChange,
}: EChartWrapperResponsiveProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartRoot, setChartRoot] = useState<ECharts | undefined>(undefined);
  const [chartInstanceRef, rect] = useResizeObserver();

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const chart = init(node, null, { renderer: "svg" });
    setChartRoot(chart);

    return () => {
      chart.dispose();
    };
  }, []);

  useDeepCompareEffect(() => {
    if (chartInstanceRef.current) {
      const chart = getInstanceByDom(chartInstanceRef.current);
      chart?.setOption(option);
    }
  }, [option]);

  // handle resize
  useDeepCompareEffect(() => {
    if (chartRoot && rect.height && rect.width) {
      chartRoot.resize();
    }
  }, [rect]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        ...style,
      }}
      role="img"
    />
  );
};

export default EChartWrapperResponsive;
