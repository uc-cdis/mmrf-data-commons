import { createGen3AppWithOwnStore, getGen3AppId } from "@gen3/core";
import { AppContext, AppStore, id } from "@/features/genomic/appApi";
import GenesAndMutationFrequencyAnalysisTool from "./GenesAndMutationFrequencyAnalysisTool";

const _APP_NAME = 'MutationFrequency'; // This will be the route name of the app
const _APP_VERSION = '1.0.0';

const AppId = getGen3AppId(_APP_NAME, _APP_VERSION);

export const registerGenesAndMutationFrequencyAnalysisTool = () => {
  createGen3AppWithOwnStore({
    App: GenesAndMutationFrequencyAnalysisTool,
    id: AppId,
    name: _APP_NAME,
    version: _APP_VERSION,
    requiredEntityTypes: [],
    store: AppStore,
    context: AppContext,
  });
}

export const GenesAndMutationFrequencyAppId: string = AppId;
export const GenesAndMutationFrequencyAppName: string = _APP_NAME;
