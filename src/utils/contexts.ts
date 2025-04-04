import { createContext, Dispatch, SetStateAction } from 'react';

type Operation =
  | Equals
  | NotEquals
  | LessThan
  | LessThanOrEquals
  | GreaterThan
  | GreaterThanOrEquals
  | Exists
  | Missing
  | Includes
  | Excludes
  | ExcludeIfAny
  | Intersection
  | Union;
interface Equals {
  readonly operator: '=';
  readonly field: string;
  readonly operand: string | number;
}
interface NotEquals {
  readonly operator: '!=';
  readonly field: string;
  readonly operand: string | number;
}
interface LessThan {
  readonly operator: '<';
  readonly field: string;
  readonly operand: string | number;
}
interface LessThanOrEquals {
  readonly operator: '<=';
  readonly field: string;
  readonly operand: string | number;
}
interface GreaterThan {
  readonly operator: '>';
  readonly field: string;
  readonly operand: string | number;
}
interface GreaterThanOrEquals {
  readonly operator: '>=';
  readonly field: string;
  readonly operand: string | number;
}
interface FilterSet {
  readonly root: Record<string, Operation>;
  readonly mode: string;
  readonly isLoggedIn?: boolean;
}

interface Missing {
  readonly operator: 'missing';
  readonly field: string;
}
interface Exists {
  readonly operator: 'exists';
  readonly field: string;
}
interface Includes {
  readonly operator: 'includes';
  readonly field: string;
  readonly operands: ReadonlyArray<string | number>;
}
interface Excludes {
  readonly operator: 'excludes';
  readonly field: string;
  readonly operands: ReadonlyArray<string | number>;
}
interface ExcludeIfAny {
  readonly operator: 'excludeifany';
  readonly field: string;
  readonly operands: string | ReadonlyArray<string | number>;
}
interface Intersection {
  readonly operator: 'and';
  readonly operands: ReadonlyArray<Operation>;
}
interface Union {
  readonly operator: 'or';
  readonly operands: ReadonlyArray<Operation>;
}
export const URLContext = createContext({ prevPath: '', currentPath: '' });

export type entityType = null | 'project' | 'case' | 'file' | 'ssms' | 'genes';
export interface entityMetadataType {
  entity_type: entityType;
  entity_id: string;
  contextSensitive?: boolean;
  contextFilters?: FilterSet;
}
export const SummaryModalContext = createContext<{
  entityMetadata: entityMetadataType;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
}>(null);
