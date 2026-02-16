import {
  convertFilterSetToGqlFilter,
  FilterSet,
  GQLIntersection,
  GQLUnion,
  guppyApi,
  isGQLIntersection,
  isIntersection,
  isUnion,
} from '@gen3/core';
import { ProjectDefaults, SortBy } from '@/core/types';
import orderBy from 'lodash/orderBy';

function capitalizeFirstLetter(inputString: string): string {
  if (!inputString) {
    return inputString; // Handle empty or null strings
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
}

const ProjectSummaryQuery = `query projectSummary($projectFilter: JSON, $fileFilter: JSON) {
    project: Project_project(filter: $projectFilter) {
        program {
            name
            program_id
            dbgap_accession_number
        }
        project_id
        name
        summary {
            case_count
            file_count
            file_size
            data_categories {
                case_count
                data_category
                file_count
            }
            experimental_strategies {
                case_count
                experimental_strategy
                file_count
            }
        }
        dbgap_accession_number
        disease_type
        primary_site
    }
    file: File__aggregation {
        file(filter: $fileFilter) {
            totalFiles: _totalCount
            file_size {
                histogram {
                    sum
                }
            }
            experimental_strategy {
                histogram {
                    key
                    count
                }
            }
            data_category {
                histogram {
                    key
                    count
                }
            }
            access {
                histogram {
                    key
                    count
                }
            }
        }
    }
}`;

const ProjectsQuery = `query projectsQuery($filter: JSON, $first: Int, $start: Int, $sort: JSON) {
    projects: Project_project(filter: $filter, first: $first, offset: $start, sort: $sort) {
        program {
            name
            program_id
            dbgap_accession_number
        }
        project_id
        name
        summary {
            case_count
            file_count
            file_size
            data_categories {
                case_count
                data_category
                file_count
            }
            experimental_strategies {
                case_count
                experimental_strategy
                file_count
            }
        }
        dbgap_accession_number
        disease_type
        primary_site
    }
    numProjects: Project__aggregation {
        project  (filter: $filter){
            _totalCount
        }
    }
}`;

const EmptyProjectDefaults: ProjectDefaults = {
  dbgap_accession_number: '',
  disease_type: [],
  name: '',
  primary_site: [],
  project_id: '',
  program: {
    dbgap_accession_number: '',
    name: '',
    program_id: '',
  },
  access: {
    controlled: 0,
    open: 0,
  },
};

const processProjectData = (data: any): ProjectDefaults => {
  if (data) {
    const project = data.project[0];
    const file = data?.file?.file ?? null;
    const fileSummary = {
      case_count: 0,
      file_count: file.totalFiles,
      file_size: file?.file_size?.histogram?.[0]?.sum ?? '0',
      data_categories:
        file.data_category.histogram.map((x: any) => ({
          file_count: x.count,
          case_count: 0,
          data_category: capitalizeFirstLetter(x.key),
        })) ?? null,
      experimental_strategies:
        file.experimental_strategy.histogram.map((x: any) => ({
          file_count: x.count,
          experimental_strategy: capitalizeFirstLetter(x.key),
        })) ?? null,
    };

    return {
      dbgap_accession_number: project?.dbgap_accession_number ?? '',
      disease_type: project.disease_type,
      primary_site: project.primary_site,
      project_id: project.project_id,
      program: {
        ...project.program,
      },
      name: project?.name ?? '',
      summary: {
        data_categories: project?.summary?.data_categories ?? [],
        experimental_strategies:
          project?.summary?.experimental_strategies ?? [],
        case_count: project?.summary?.case_count ?? 0,
        file_count: fileSummary?.file_count ?? 0,
        file_size: fileSummary?.file_size ?? '0',
      },
      access: file.access?.histogram.reduce(
        (acc: Record<string, number>, x: any) => {
          acc[x.key] = x.count;
        },
        {},
      ),
    } satisfies ProjectDefaults;
  }
  return EmptyProjectDefaults;
};

interface ProjectsRequest {
  filter: FilterSet;
  from?: number;
  size?: number;
  sortBy?: SortBy[];
  searchTerm?: string;
}

interface ProjectsResponse {
  projects: ProjectDefaults[];
  totalProjects: number;
}

/**
 * Used for the Project Summary page.
 */
export const projectsApiSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    projectSummary: builder.query<ProjectDefaults, string>({
      query: (projectId: string) => ({
        query: ProjectSummaryQuery,
        variables: {
          projectFilter: { eq: { project_id: projectId } },
          fileFilter: { eq: { 'cases.project.project_id': projectId } },
        },
      }),
      transformResponse: (response: any) => processProjectData(response?.data),
    }),
    projects: builder.query<ProjectsResponse, ProjectsRequest>({
      query: ({  size, from, searchTerm }: ProjectsRequest) => {
        let filters  = {}
        if (searchTerm && searchTerm.length > 0) {
          filters =
              { search: { keyword: searchTerm, fields: ['project_id'] } }
        }
        return {
          query: ProjectsQuery,
          variables: {
            filter: filters,
            first: size ?? 20,
            start: from ?? 0,
            sort: {} // NOTE: The mapping of summary causes issues with guppy's sort. This response
                      // will be small (for now) so we will ort the response
          },
        };
      },
      transformResponse: (response: any, arg0, params ) => {
        const projects = response?.data?.projects;
        const sortedProjects = orderBy(projects, params.sortBy?.map(x=>x.field), params.sortBy?.map(x => x.direction))
        return {
          projects: sortedProjects,
          totalProjects: response?.data?.numProjects?.project?._totalCount ?? 0,
        };
      },
    }),
  }),
});

export const { useProjectSummaryQuery, useProjectsQuery } = projectsApiSlice;
