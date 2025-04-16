import React from 'react';
import { humanify } from '../../../../utils';

const SMTableConsequences = ({
  consequences,
}: {
  consequences: string;
}): JSX.Element => (
  <span className="font-content text-left">
    {!consequences
      ? '--'
      : humanify({
          term: consequences?.replace('_variant', '').replace('_', ' '),
        })}
  </span>
);

export default SMTableConsequences;
