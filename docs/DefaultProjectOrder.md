You can order the projects in the default way by changing the default sort in `src/features/projectsCenter/ProjectsTable.tsx` around
line 235:
```tsx
  const [sorting, setSorting] = useState<SortingState>([
  { id: 'project', desc: true },
]);

```
