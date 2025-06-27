import React from 'react';
import {
  createDispatchHook,
  createSelectorHook,
  ReactReduxContextValue,
  TypedUseSelectorHook,
} from 'react-redux';

export const CoreContext = React.createContext<any>(
  undefined as unknown as ReactReduxContextValue<any>,
);

export const useCoreSelector: TypedUseSelectorHook<any> =
  createSelectorHook(CoreContext);
// export type CoreDispatch = typeof coreStore.dispatch;
export const useCoreDispatch: () => any = createDispatchHook(CoreContext);
