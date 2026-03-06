# Clinical Data Visualization Configuration
Clinical Data Visualization (CDave) configuration is somewhat complicated, as it was refactored from the original V1 GDC
Portal with some additional features.

The Field definitions come from the `src/features/apps/config/fieldDefinitions.json` file. This data is pulled from
the data dictionary. If you change the data dictionary, and you want to add new fields, you must update this file.

To add Groups and Fiels to CDave you need to update the constant in `src/features/cDave/constants.ts`.
```typescript
export const FACET_SORT: Record<string, Array<string>> = {
  demographic: [
    'gender',
    'race',
    'ethnicity',
    'vital_status',
    'age_at_index',
    'age_at_diagnosis',
    'year_of_death',
    'days_to_death',
  ],
  diagnoses: [
    'days_to_diagnosis',
    'days_to_last_follow_up',
    'iss_stage',
  ],
  bone_assessments: [
    'lytic_bone_lesion_present',
    'mm_bone_lesion_femur',
    'mm_bone_lesion_pelvis',
    'mm_bone_lesion_ribs',
    'mm_bone_lesion_skull',
    'mm_bone_lesion_spine',
    'number_of_lytic_lesions',
    'osteopenia_osteoporosis',
  ],
};
```
In the above the `group` is defined as an array of fields. The field just need to contain the name of the fiel not the
prefix, as that is merged with the `group` name. Note the fields in the UI panel are in the same order as the fields in the
`group` array.

### Naming the `Tabs`

The label of the tabs is set in the `src/features/cDave/constants.ts` file by the `TABS` constant.
```typescript
export const TABS = {
  demographic: 'Demographic',
  diagnoses: 'Diagnosis',
  bone_assessments: 'Bone Assessment',
  exposures: 'Exposures',
  other_clinical_attributes: 'Other Clinical Attribute',
};
```

You can add new tabs by adding a new entry to the `TABS` constant and adding a new entry to the `FACET_SORT` constant.

### Continuous Variables

Continuous variables need to have the range set in the `src/features/cDave/constants.ts` file, using the
`CONTINUOUS_FACET_RANGES` constant.
```typescript
export const CONTINUOUS_FACET_RANGES: Record<
  string,
  { min: number; max: number; step: number }
> = {
  'demographic.age_at_index': {
    min: 0,
    max: 89,
    step: 10,
  },
  'demographic.days_to_death': {
    max: 32872,
    min: 0,
    step: 10,
  },
  'demographic.year_of_death': {
    max: 2050,
    min: 1990,
    step: 10,
  },
  'diagnoses.days_to_diagnosis': {
    max: 32872,
    min: 0,
    step: 3652.5,
  },
  'diagnoses.days_to_last_follow_up': {
    max: 32872,
    min: 0,
    step: 3652.5,
  },
};
```

Where the key is the field name, and the value is an object with the min, max, and step values for the range.
For example, diagnoses.days_to_diagnosis has a range from 0 to 32872 with a step of 3652.5. which models a range of
days from 0 to 90 years


### Data Dimensions
The data dimensions are defined using the `DATA_DIMENSIONS` in the `src/features/cDave/constants.ts` file.
The key is the field name with its prefix, and the value is the label to display in the UI. `toggleValue`
allows the user to toggle the value between the two values.

The possible values are:
* "Years"
* "Days"
* "Kilograms"
* "Centimeters"
* "Unset"
* "Year"

### Additional Constants
There are other constants that set colors, capitalization, other display settings.
