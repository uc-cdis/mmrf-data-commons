## Switching to Chorts Filters When Creating Cohorts
Currently, when a cohort is created, the case_ids are used to to represet the cohort, instead of the cohort filters.

To change this, you will need to refactor: `src/features/cases/CasesCohortButton/CasesCohortButton.tsx`
and look at the code used to create the cohort.
There is a `asFilterRepresentation` prioperty that you can use to create a cohort usign the filters and not the case_ids.
Note that is only possible with `Only Selected Cases` option.
