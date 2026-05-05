import React, { useRef, useState, FC } from "react";
import { useDeepCompareEffect } from "use-deep-compare";
import { bindProteinPaint } from "@sjcrh/proteinpaint-client";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import {
  useCoreSelector,
  FilterSet,
  //PROTEINPAINT_API,
  useFetchUserDetailsQuery,
  useCoreDispatch,
  convertFilterSetToGqlFilter as buildCohortGqlOperator
} from "@gen3/core";
import { SelectSamples, SelectSamplesCallback } from "./sjpp-types";
import { isEqual, cloneDeep } from "lodash";
import { DemoText } from "@/components/tailwindComponents";
import { selectCurrentCohortCaseFilters } from "@/core/utils";
import { COHORT_FILTER_INDEX, PROTEINPAINT_API } from '@/core';
import { updateFilters } from './updateFilters';

const basepath = PROTEINPAINT_API;

interface PpProps {
  basepath?: string;
}

export const ProteinPaintWrapper: FC<PpProps> = (props: PpProps) => {
  const isDemoMode = useIsDemoApp();
  const currentCohort = useCoreSelector((state) =>
    selectCurrentCohortCaseFilters(state, COHORT_FILTER_INDEX),
  );
  const filter0 = isDemoMode ? null : buildCohortGqlOperator(currentCohort);
  const userDetails = useFetchUserDetailsQuery()

  // to track reusable instance for mds3 skewer track
  const prevArg = useRef<any>({});
  const coreDispatch = useCoreDispatch();
  const [showSaveCohort, setShowSaveCohort] = useState(false);
  //const [createSet, response] = useCreateCaseSetFromValuesMutation();
  // const [newCohortFilters, setNewCohortFilters] =
  //   useState<FilterSet>(undefined);

  // a set for the new cohort is created, now show the save cohort modal
  // useDeepCompareEffect(() => {
  //   if (response.isSuccess) {
  //     const filters: FilterSet = {
  //       mode: "and",
  //       root: {
  //         "cases.case_id": {
  //           operator: "includes",
  //           field: "cases.case_id",
  //           operands: [`set_id:${response.data}`],
  //         },
  //       },
  //     };
  //     setNewCohortFilters(filters);
  //     setShowSaveCohort(true);
  //   }
  // }, [response.isSuccess, coreDispatch, response.data]);

  useDeepCompareEffect(
    () => {
      const rootElem = divRef.current;
      const data = getLollipopTrack(props, updateFilters, filter0);
      if (!data) return;
      /*if (isDemoMode) {
        data.geneSymbol = props.hardcodeCnvOnly
          ? "chr8:127682515-127792250"
          : "MYC";
      }*/

      // compare the argument to runpp to avoid unnecessary render
      if ((data || prevArg.current) && isEqual(prevArg.current, data)) return;
      prevArg.current = data

      const toolContainer = rootElem?.parentNode?.parentNode?.parentNode as HTMLElement;
      if (!toolContainer) return
      toolContainer.style.backgroundColor = "#fff";

      const arg = Object.assign(
        { holder: rootElem, noheader: true, nobox: true },
        cloneDeep(data),
      ) as Mds3Arg;

      // bindProteinPaint() handles rapid update requests/race condition,
      // so no need to include debouncing and promise code in this wrapper
      // TODO: will revert to using runproteinpaint() once these advanced capabilities
      // are merged into it
      bindProteinPaint({
        rootElem,
        initArgs: arg,
        updateArgs: arg,
        isStale() {
          // new data has replaced this one, will prevent unnecessary render
          // in case of race condition
          return prevArg.current != data;
        },
      });
    },

    [ isDemoMode, filter0, userDetails.currentData ],
  );

  const divRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      {isDemoMode && <DemoText>Showing cases in demo cohort.</DemoText>}
      <div
        ref={divRef}
        className="sjpp-wrapper-root-div"
        //userDetails={userDetails}
      />

      {/*<SaveCohortModal // Show the modal, create a saved cohort when save button is clicked
        opened={showSaveCohort}
        onClose={() => setShowSaveCohort(false)}
        filters={newCohortFilters}
        hooks={cohortActionsHooks}
        invalidCohortNames={INVALID_COHORT_NAMES}
      />*/}
    </div>
  );
};

interface Mds3Arg {
  dslabel?: string;
  holder?: HTMLElement;
  noheader?: boolean;
  nobox?: boolean;
  hide_dsHandles?: boolean;
  host: string;
  filter0?: FilterSet;
  geneSearch4GDCmds3: any;
  allow2selectSamples: SelectSamples;
}

function getLollipopTrack(
  props: PpProps,
  callback: SelectSamplesCallback,
  filter0: any
) {
  const arg: Mds3Arg = {
    dslabel: 'MMRF',
    // host in gdc is just a relative url path,
    // using the same domain as the GDC portal where PP is embedded
    host: props.basepath || (basepath as string),
    noheader: true,
	  geneSearch4GDCmds3: { snvIndelOnly: true },
    hide_dsHandles: true,
    filter0,
    allow2selectSamples: {
      buttonText: "Create Cohort",
      attributes: [{
        from: "sample_id",
        to: "cases.case_id",
        convert: true
      }],
      callback
    }
  };

  return arg;
}
