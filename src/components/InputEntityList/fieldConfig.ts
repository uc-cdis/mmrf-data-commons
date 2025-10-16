export default {
  genes: {
    searchField: "gene_autocomplete.lowercase",
    mappedToFields: ["symbol"],
    matchAgainstIdentifiers: [
      "symbol",
    ],
    fieldDisplay: {
      symbol: "Symbol",
    },
    outputField: "symbol",
    facetField: "gene_id",
  },
  ssms: {
    searchField: "ssm_autocomplete.lowercase",
    mappedToFields: ["ssm_id"],
    matchAgainstIdentifiers: ["ssm_id"],
    fieldDisplay: {
      ssm_id: "Mutation UUID",
    },
    outputField: "ssm_id",
    facetField: "ssm_id",
  },
};
