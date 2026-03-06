# Configuration Files

This document provides an overview of the configuration files used in the cDave project and their purposes.

## General Gen3 Configuration Files
located in `config/gen3`. These files controls the behavior of login, color theming, user sessions, modals, and the discovery page.
You note there is a navigation.json file that is part of gen3 but is not used for MMRF.

## MMRF Configuration Files
located in `config/mmrf`.
The MMRF configuration files are designed to customize the navigation bar and the footer.

## Repository and Cohort Configuration Files
The repository and cohort configuration files are located in `src/features/apps/config`.

### Adding a Field to a Repository
To add a field to a repository, you need to update the `repository.json` file.
The `field` member controls the fields that appear on the repository page.
```json
 "filters": {
    "tabs": [
      {
        "title": "Filters",
        "fields": [
          "experimental_strategy",
          "data_category",
          "data_type",
          "data_format",
          "downstream_analyses.workflow_type"
        ]
      }
    ]
  },
```

To add a nested field `downstream_analyses.workflow_type"` ensure the path is correct.
