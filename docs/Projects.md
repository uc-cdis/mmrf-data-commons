## Project Configuration

### Project Center

If you want to change Case to Subject is can be done here:

`src/features/projectsCenter/ProjectsTable.tsx`, in the column definition:

Note that the table uses the accessor function to get the value from the row. Vertical table is
based on Tanstack Table. You can find more information about the accessor function here:
https://tanstack.com/table/v8/docs/api/core/column-def

To change the column name, modify the `header` property:
```typescript
projectsTableColumnHelper.accessor('cases', {
id: 'cases',
header: 'Cases',
cell: ({ getValue }) => getValue().toLocaleString().padStart(9),
enableSorting: true,
}),
```

## Project Summary Page

The project summary page is located in `src/features/projectSummary/ProjectSummary.tsx`.
If you want to change the information,
you can modify the `ProjectSummary` component, for example, you can change 'Cases' to 'Subjects'
by modifying the `ProjectSummary` component:

```typescript
      <SummaryHeader
        iconPath='mmrf:projects'
        headerTitleLeft="Project"
        headerTitle={projectData.project_id}
        isModal={projectData.isModal}
        leftElement={<div className="flex items-center text-sm md:text-xl xl:text-xl 2xl:text-xl text-base-lightest leading-4 font-montserrat uppercase whitespace-no-wrap">{projectData.name}</div>}
        rightElement={
          <div className="flex items-center gap-2 text-sm md:text-xl xl:text-xl 2xl:text-xl text-base-lightest leading-4 font-montserrat uppercase whitespace-no-wrap">
            Total of {Cases} {Files}
          </div>
        }
      />
  ```
