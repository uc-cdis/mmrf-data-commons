/*
 * Data Access Hooks
 */

import { useEffect, useRef } from 'react';

/**
 * hook to get the previous state of a prop.
 * See: https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 * NOTE: if component using this defines a key prop ensure the key id persist between renders
 */
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
