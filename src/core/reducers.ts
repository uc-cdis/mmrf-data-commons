import React from 'react';
import {
  createSelectorHook,
  ReactReduxContextValue,
  TypedUseSelectorHook,
} from 'react-redux';
import { CoreState } from './reducers';

export const CoreContext = React.createContext<any>(
  undefined as unknown as ReactReduxContextValue<CoreState>,
);

export const useCoreSelector: TypedUseSelectorHook<CoreState> =
  createSelectorHook(CoreContext);
