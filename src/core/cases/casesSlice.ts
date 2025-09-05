
import { Pagination, EndpointRequestProps,  AnnotationDefaults, CaseDefaults, GdcApiData} from "@/core/features/api";
import case0 from './data/71d7cb4b-f82a-42f8-88a9-c4ed03466b6d.json';
import case1 from './data/c27ab9c4-03ad-46de-abfb-2ffcb5a92790.json';
import { DataFetchingResult } from '@/core';


export const useGetCasesQuery = (request: EndpointRequestProps, which: number = 0) : DataFetchingResult<any> => {

  let data: any = case0;
  if (which === 1)
    data = case1;

  return ({
    data: data,
    isFetching: false,
    isSuccess: true,
    isUninitialized: false,
    isError: false
  })


}
