import { createGdcApp, getGen3AppId } from '@gen3/core';
import CohortComparisonApp from './CohortComparisonApp';

const _APP_NAME = 'CohortComparison'; // This will be the route name of the app
const _APP_VERSION = '1.0.0';

const AppId = getGen3AppId(_APP_NAME, _APP_VERSION);
export const registerCohortComparisonApp = () =>
  createGdcApp({
    App: CohortComparisonApp,
    id: AppId,
    name: _APP_NAME,
    version: 'v1.0.0',
    requiredEntityTypes: [],
  });

export const CohortComparisonAppName = _APP_NAME;
