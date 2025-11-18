import { GetServerSideProps } from 'next';
import {
  getNavPageLayoutPropsFromConfig,
  type DictionaryConfig,
  ContentSource
} from "@gen3/frontend"
import { GEN3_COMMONS_NAME } from '@gen3/core';
import { DictionaryPageProps } from '@/lib/DataDictionary/types';


export const MAX_SEARCH_HISTORY = 10;
export const KEY_FOR_SEARCH_HISTORY = 'mmrf-dictionary-search';

export const DictionaryPageGetServerSideProps: GetServerSideProps<
  DictionaryPageProps
> = async () => {
  try {
    const cohortBuilderProps: DictionaryConfig =
      await ContentSource.getContentDatabase().get(
        `${GEN3_COMMONS_NAME}/dictionary.json`,
      );
    return {
      props: {
        ...(await getNavPageLayoutPropsFromConfig()),
        config: cohortBuilderProps,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        ...(await getNavPageLayoutPropsFromConfig()),
        config: {
          showGraph: false,
          showDownloads: false,
          historyStorageId: KEY_FOR_SEARCH_HISTORY,
          maxHistoryItems: MAX_SEARCH_HISTORY,
        },
      },
    };
  }
};
