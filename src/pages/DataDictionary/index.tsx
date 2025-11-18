import React from 'react';
import { DictionaryWithContext } from '@gen3/frontend';
import { DictionaryPageProps } from '@/lib/DataDictionary/types';

const DictionaryPage = ({
  config,
}: DictionaryPageProps): JSX.Element => {
  return (
    <div className="flex">
      <DictionaryWithContext config={config} />
    </div>
  );
};

export default DictionaryPage;
