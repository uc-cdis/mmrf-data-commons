
import { Pagination, EndpointRequestProps,  AnnotationDefaults, CaseDefaults, GdcApiData} from "@/core/features/api";
import case0 from './data/71d7cb4b-f82a-42f8-88a9-c4ed03466b6d.json';
import case1 from './data/c27ab9c4-03ad-46de-abfb-2ffcb5a92790.json';


interface CaseResponseData extends CaseDefaults {
  annotations: AnnotationDefaults[];
}

interface CasesResponse {
  readonly pagination: Pagination;
  readonly data: readonly CaseResponseData[];
}

export const useGetCasesQuery = (request: EndpointRequestProps, which: number = 0) : GdcApiData<CaseDefaults> => {
  if (which === 1)
    return case1 as unknown as  GdcApiData<CaseDefaults>;
    return case0 as unknown as  GdcApiData<CaseDefaults>;
}