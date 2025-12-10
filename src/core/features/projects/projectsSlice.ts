import { guppyApi} from "@gen3/core";
import { ProjectDefaults } from '@/core/types';

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


/**
 * Used for the Project Summary page.
 */
export const projectsApiSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectDefaults, string>({
      query: (projectId: string) => ({
        query: ProjectSummaryQuery,
        variables: {
          projectFilter : { "eq" : { project_id : projectId}},
          fileFilter: { "eq" : { "cases.project.project_id" : projectId}}
        }
      }),
      // @ts-expect-error transformResponse is not typed correctly
      transformResponse: (response: any) => {
        if (response?.data) {
          const project = response.data.project[0];
          const file = response.data.file.file;
          const fileSummary = {
            case_count: 0,
            file_count: file.totalFiles,
            file_size: file?.file_size?.histogram?.[0]?.sum ?? '0',
            data_categories: file.data_category.histogram.map((x: any) => ({
              file_count: x.count, case_count: 0, data_category: capitalizeFirstLetter(x.key)
            })),
            experimental_strategies: file.experimental_strategy.histogram.map((x: any) => ({
              file_count: x.count, case_count: 0, data_category: capitalizeFirstLetter(x.key)
            })),
            };

          return {
            dbgap_accession_number:
              project?.dbgap_accession_number ?? '',
            disease_type: project.disease_type,
            primary_site: project.primary_site,
            project_id: project.project_id,
            program: {
              ...project.program
            },
            name: project?.name ?? "",
            summary: {
              ...fileSummary,
              case_count: project?.summary?.case_count ?? 0
            },
            access: file.access?.histogram.reduce((acc: Record<string, number>, x: any) => {
              acc[x.key] = x.count
            }, {})

          } satisfies ProjectDefaults;
        }
        return {
          projectData: undefined,
        };
      },
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApiSlice;
