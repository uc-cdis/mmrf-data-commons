import React from 'react';
// Credits to https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/modern_components/BiospecimenCard/utils.js for useful utilities functions
import {
  formatDataForHorizontalTable,
  mapGdcFileToCartFile,
} from '../files/utils';
import { ActionIcon, Tooltip } from '@mantine/core';
import Link from 'next/link';
/* import {
  CartFile,
  CoreDispatch,
  BiospecimenEntityType,
  FileDefaults,
  mapFileData,
} from "@gff/core"; */
// import { addToCart, removeFromCart } from '@/features/cart/updateCart';
import { get } from 'lodash';
import { entityTypes } from '@/components/BioTree/types';
import { humanify, fileInCart, ageDisplay } from 'src/utils';
// import { DownloadFile } from '@/components/DownloadButtons';
import { CartIcon, MicroscopeIcon } from '@/utils/icons';
import { CoreDispatch } from '@gen3/core';
import { BiospecimenEntityType } from './types';
import { FileDefaults } from '@/core/features/api/types';
import { CartFile } from '@/core/types';

const addToCart = (a: any, b: any, c: any) => alert('called addToCart');
const removeFromCart = (a: any, b: any, c: any) =>
  alert('called removeFromCart');
const mapFileData = () => console.log('called mapFileData');
const DownloadFile = (a: any) =>
  alert('called download file in utils of biospecimen');
export const match = (query: string, entity: Record<string, any>): boolean =>
  Object.keys(entity).some((k) => {
    return (
      typeof entity[k] === 'string' && entity[k].toLowerCase().includes(query)
    );
  });

export const searchForStringInNode = (
  query: string,
  entity: { node: Record<string, any> },
): any[] => {
  const found = [];

  function searchEntity(entity: any, _type: any, parents: any) {
    if (entity.node && match(query, entity.node)) found.push(entity);

    entityTypes?.forEach((_type) => {
      get(entity, `node[${_type.p}].hits.edges`, []).forEach((child: any) => {
        searchEntity(child, _type.s, [entity[_type.p], entity].concat(parents));
      });
    });
  }

  if (entity.node && match(query, entity.node)) found.push(entity);

  entityTypes?.forEach((type) => {
    get(entity, `node[${type.p}].hits.edges`, []).forEach((child: any) => {
      searchEntity(child, type.s, [
        entity[type.p as keyof BiospecimenEntityType],
        entity,
      ]);
    });
  });

  return found;
};

export const idFields = [
  'sample_id',
  'portion_id',
  'analyte_id',
  'slide_id',
  'aliquot_id',
];

export const formatEntityInfo = (
  entity: BiospecimenEntityType,
  foundType: string,
  caseId: string,
  dispatch: CoreDispatch,
  currentCart: CartFile[],
  selectedSlide: readonly FileDefaults[],
): {
  readonly headerName: string;
  readonly values: readonly (
    | string
    | number
    | boolean
    | JSX.Element
    | readonly string[]
  )[];
}[] => {
  const uuIDIndexer = idFields.find(
    (id) => entity?.[id as keyof BiospecimenEntityType],
  ) as keyof BiospecimenEntityType;
  const uuIDResult = entity?.[uuIDIndexer];
  const ids = {
    [`${foundType}_ID`]: entity?.submitter_id,
    [`${foundType}_UUID`]: uuIDResult,
  };

  const ordered: Record<string, any> = Object.entries(
    getOrder(foundType)?.reduce((next, k) => {
      return { ...next, [k]: entity[k] };
    }, {}) ?? {},
  );

  const filtered = Object.entries(ids).concat(
    ordered
      .filter(
        ([key]) =>
          ![
            'submitter_id',
            'expanded',
            `${foundType}_id`,
            '__dataID__',
          ].includes(key),
      )
      .map(([key, value]) => [
        key,
        ['portions', 'aliquots', 'analytes', 'slides'].includes(key)
          ? value.hits.total
          : value,
      ]),
  );

  // const isFileInCart = fileInCart(currentCart, selectedSlide[0]?.file_id);
  const isFileInCart = false;

  if (foundType === 'slide' && !!selectedSlide[0]) {
    filtered.push([
      'Slide Image',
      <div className="flex gap-4" key={selectedSlide[0]?.file_id}>
        <Tooltip label="View Slide Image" withinPortal={true} withArrow>
          <ActionIcon
            data-testid="button-view-slide-image-biospecimen"
            variant="outline"
            size="sm"
            className="w-8 p-0 h-6 text-primary bg-base-max border-primary hover:bg-primary hover:text-base-max"
            aria-label="View Slide Image"
          >
            <Link
              href={`/image-viewer/MultipleImageViewerPage?caseId=${caseId}&selectedId=${selectedSlide[0]?.file_id}`}
            >
              <MicroscopeIcon size={17} />
            </Link>
          </ActionIcon>
        </Tooltip>

        <Tooltip
          label={isFileInCart ? 'Remove from Cart' : 'Add to Cart'}
          withinPortal={true}
          withArrow
        >
          <ActionIcon
            data-testid="button-add-remove-cart-biospecimen"
            variant="outline"
            size="sm"
            className={`w-8 h-6 p-0 border-primary hover:bg-primary hover:text-base-max ${
              isFileInCart
                ? 'bg-primary text-base-max'
                : 'text-primary bg-base-max'
            }`}
            onClick={() => {
              if (isFileInCart) {
                removeFromCart(
                  mapGdcFileToCartFile(mapFileData(selectedSlide)),
                  currentCart,
                  dispatch,
                );
              } else {
                addToCart(
                  mapGdcFileToCartFile(mapFileData(selectedSlide)),
                  currentCart,
                  dispatch,
                );
              }
            }}
          >
            <CartIcon size={16} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Download" withinPortal={true} withArrow>
          <div data-testid="button-download-slide-biospecimen">
            <DownloadFile
              file={mapFileData(selectedSlide)[0]}
              displayVariant="icon"
            />
          </div>
        </Tooltip>
      </div>,
    ]);
  }

  const headersConfig = filtered.map(([key]) => {
    const tempHeaderConfig: { field: string; name: string; modifier?: any } = {
      field: key,
      name: humanify({ term: key }),
    };
    //Format day fields
    if (['days_to_sample_procurement', 'days_to_collection'].includes(key)) {
      tempHeaderConfig.modifier = (a) => ageDisplay(a);
    }
    return tempHeaderConfig;
  });

  const obj = { ...ids, ...Object.fromEntries(filtered) };

  return formatDataForHorizontalTable(obj, headersConfig);
};

const getOrder = (type: any) => {
  const sampleOrder = [
    'submitter_id',
    'sample_id',
    'tissue_type',
    'tumor_descriptor',
    'specimen_type',
    'preservation_method',
    'tumor_code_id',
    'shortest_dimension',
    'intermediate_dimension',
    'longest_dimension',
    'pathology_report_uuid',
    'current_weight',
    'initial_weight',
    'time_between_clamping_and_freezing',
    'time_between_excision_and_freezing',
    'days_to_sample_procurement',
    'freezing_method',
    'days_to_collection',
    'portions',
  ];

  const portionOrder = [
    'submitter_id',
    'portion_id',
    'portion_number',
    ' weight',
    'is_ffpe',
    'analytes',
    'slides',
  ];

  const analytesOrder = [
    'submitter_id',
    'analyte_id',
    'analyte_type',
    'well_number',
    'amount',
    'a260_a280_ratio',
    'concentration',
    'spectrophotometer_method',
    'aliquots',
  ];

  const slidesOrder = [
    'submitter_id',
    'slide_id',
    'percent_tumor_nuclei',
    'percent_monocyte_infiltration',
    'percent_normal_cells',
    'percent_stromal_cells',
    'percent_eosinophil_infiltration',
    'percent_lymphocyte_infiltration',
    'percent_neutrophil_infiltration',
    'section_location',
    'percent_granulocyte_infiltration',
    'percent_necrosis',
    'percent_inflam_infiltration',
    'number_proliferating_cells',
    'percent_tumor_cells',
  ];

  const aliquotOrder = [
    'submitter_id',
    'aliquot_id',
    'source_center',
    'amount',
    'concentration',
    'analyte_type',
  ];

  let order;
  switch (type) {
    case 'sample':
      order = sampleOrder;
      break;
    case 'portion':
      order = portionOrder;
      break;
    case 'aliquot':
      order = aliquotOrder;
      break;
    case 'slide':
      order = slidesOrder;
      break;
    case 'analyte':
      order = analytesOrder;
      break;
  }

  return order;
};
