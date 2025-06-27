import { createGen3AppWithOwnStore } from "@gen3/core";
import { AppContext, AppStore, id } from "@/features/genomic/appApi";
import GenesAndMutationFrequencyAnalysisTool from "./GenesAndMutationFrequencyAnalysisTool";

export default createGen3AppWithOwnStore({
  App: GenesAndMutationFrequencyAnalysisTool,
  id: id,
  name: "Genes and MutationFrequency",
  version: "v1.0.0",
  requiredEntityTypes: [],
  store: AppStore,
  context: AppContext,
});

export const GenesAndMutationFrequencyAppId: string = id;
