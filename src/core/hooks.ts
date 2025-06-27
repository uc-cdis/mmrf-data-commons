import React from 'react';
import {
  createDispatchHook,
  createSelectorHook,
  ReactReduxContextValue,
  TypedUseSelectorHook,
} from 'react-redux';
// import { CoreDispatch } from './store';

export const CoreContext = React.createContext<any>(
  undefined as unknown as ReactReduxContextValue<any>,
);

export const useCoreSelector: TypedUseSelectorHook<any> =
  createSelectorHook(CoreContext);

export const useCoreDispatch: () => CoreDispatch =
  createDispatchHook(CoreContext);
