import React, { useLayoutEffect, MouseEvent } from "react";
import { renderPlot } from "@oncojs/survivalplot";
import { useResizeObserver } from "@mantine/hooks";
import { MINIMUM_CASES, UseSurvivalType,  } from "./types";
import { DAYS_IN_YEAR } from '@/core/constants';
import { DAYS_IN_MONTH_ROUNDED } from "./utils";
import { SurvivalElement, SurvivalDonor } from '@/core/survival';

// based on schemeCategory10
// 4.5:1 colour contrast for normal text
const textColors = [
  "#8d3859",
  "#FCA88D",
  "#258825",
  "#D62728",
  "#8E5FB9",
  "#8C564B",
  "#D42BA1",
  "#757575",
  "#7A7A15",
  "#10828E",
];

const SVG_MARGINS = {
  bottom: 40,
  left: 50,
  right: 20,
  top: 15,
};

export const useSurvival: UseSurvivalType = (
  data,
  xDomain,
  setXDomain,
  height,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setTooltip = (_x?) => null,
  setEntityMetadata,
) => {
  const [ref, rect] = useResizeObserver();

  useLayoutEffect(() => {
    if (ref.current) {
      renderPlot({
        height,
        container: ref.current,
        palette: textColors,
        margins: SVG_MARGINS,
        dataSets: data,
        shouldShowConfidenceIntervals: false,
        confidenceAreaOpacity: 0.2,
        xAxisLabel: "Duration (years)",
        yAxisLabel: "Survival Rate",
        xDomain: xDomain,
        onDomainChange: setXDomain,
        minimumDonors: MINIMUM_CASES,
        getSetSymbol: (curve: SurvivalElement, curves: SurvivalElement[]) =>
          curves.length === 1
            ? ""
            : `<tspan font-style="italic">S</tspan><tspan font-size="0.7em" baseline-shift="-25%">${
                curves.indexOf(curve) + 1
              }</tspan>`,
        onMouseEnterDonor: (
          e : MouseEvent<HTMLElement>,
          { censored, project_id, submitter_id, survivalEstimate, time = 0 } : SurvivalDonor,
        ) => {
          const days = Math.round(time * DAYS_IN_YEAR); // Converting to actual days from API
          const months = Math.round(days / DAYS_IN_MONTH_ROUNDED);
          const years = Number(time.toFixed(1));
          const yearsString = years === 1 ? "year" : "years";
          const monthsString = months === 1 ? "month" : "months";
          const timeString = `${years} ${yearsString} (${months} ${monthsString})`;

          setTooltip(
            <div className="font-montserrat text-xs bg-base-darkest text-base-contrast-darkest shadow-md p-1">
              <span className="font-bold">Case ID:&#160;</span>
              {`${project_id} / ${submitter_id}`}
              <br />
              <span className="font-bold">Survival Rate:&#160;</span>
              {`${Math.round(survivalEstimate * 100)}%`}
              <br />
              <span className="font-bold">
                {censored ? "Interval of last follow-up: " : "Time of Death: "}
              </span>
              {timeString}
            </div>,
          );
        },
        onClickDonor: (_e : MouseEvent<HTMLElement>, { id } : { id : string }) => {
          if (setEntityMetadata) setEntityMetadata({
            entity_type: "case",
            entity_id: id,
          });
        },

        onMouseLeaveDonor: () => setTooltip(undefined),
      });
    }
  }, [
    ref,
    data,
    xDomain,
    setXDomain,
    setTooltip,
    height,
    rect,
    setEntityMetadata,
  ]);

  return ref;
};
