import React, { useEffect, useRef } from 'react';
import Highlight from './Highlight';
import { BioTreeProps, NodeProps, overrideMessage } from './types';
import { UnstyledButton } from '@mantine/core';
import { ArrowRight, CollapsedNodeIcon, ExpandNodeIcon } from '@/utils/icons';
import { BiospecimenEntityType } from '@/features/biospecimen/types';

const Node = ({
  entity,
  entityTypes,
  type,
  children,
  selectedEntity,
  selectEntity,
  query,
}: NodeProps): JSX.Element => {
  const idKey = `${type.s}_id` as keyof BiospecimenEntityType;

  return (
    <li className="ml-6">
      {entity && entity[idKey] && entity.submitter_id && (
        <div className="flex">
          <span
            className={`w-full flex justify-between text-xs cursor-pointer hover:underline
              hover:font-bold ml-3 mt-1 py-1 px-6 border border-base-lighter ${
                (selectedEntity?.[idKey] as unknown as any) ===
                (entity[idKey] as unknown as any)
                  ? 'bg-accent-vivid text-base-max font-bold'
                  : 'bg-nci-violet-lightest'
              }
         `}
            onClick={() => {
              selectEntity(entity, type);
            }}
            onKeyDown={() => {
              selectEntity(entity, type);
            }}
            role="button"
            tabIndex={0}
          >
            <Highlight search={query} text={entity.submitter_id} />
            {selectedEntity?.[idKey] === entity[idKey] && (
              <ArrowRight color="white" size={16} />
            )}
          </span>
        </div>
      )}
      {entityTypes
        .filter(
          (childType) =>
            entity &&
            entity[childType.p as keyof BiospecimenEntityType] &&
            (entity[childType.p as keyof BiospecimenEntityType] as any).hits
              .total > 0,
        )
        .map((childType) =>
          React.cloneElement(children, {
            entities:
              entity && entity[childType.p as keyof BiospecimenEntityType],
            key: childType.p,
            type: childType,
          }),
        )}
    </li>
  );
};

export const BioTree = ({
  entities,
  entityTypes,
  type,
  parentNode,
  treeStatusOverride,
  setTreeStatusOverride,
  selectedEntity,
  selectEntity,
  setExpandedCount,
  setTotalNodeCount,
  query,
  search,
}: BioTreeProps): JSX.Element => {
  const shouldExpand =
    parentNode === 'root' ||
    [overrideMessage.Expanded, overrideMessage.QueryMatches].includes(
      treeStatusOverride as overrideMessage,
    );

  const isExpanded = useRef(shouldExpand);

  let entitiesHitsEdges;
  if (entities && entities?.hits?.edges)
    entitiesHitsEdges = entities.hits.edges;

  useEffect(() => {
    if (query.length > 0) {
      if (
        (entities &&
          entities.hits.edges.some((e) => search(query, e as any).length)) ||
        ['samples', 'portions', 'analytes', 'aliquots', 'slides'].find((t) =>
          t.includes(query),
        ) ||
        type.p.includes(query)
      ) {
        isExpanded.current = true;
        setTreeStatusOverride(overrideMessage.QueryMatches);
      } else {
        isExpanded.current = false;
        setTreeStatusOverride(null as unknown as overrideMessage);
      }
    } else if (treeStatusOverride) {
      const override = treeStatusOverride === overrideMessage.Expanded;
      isExpanded.current = override;
      if (override) {
        setExpandedCount((c) => c + 1);
      }
    }
  }, [
    treeStatusOverride,
    query,
    setExpandedCount,
    setTotalNodeCount,
    entitiesHitsEdges,
    search,
    setTreeStatusOverride,
    type.p,
  ]);

  useEffect(() => {
    setTotalNodeCount((c) => c + 1);

    return () => {
      setTotalNodeCount((c) => c - 1);
      if (isExpanded.current) {
        setExpandedCount((c) => Math.max(c - 1, 0));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTreeClick = () => {
    if (query) return;
    isExpanded.current = !isExpanded.current;
    if (isExpanded.current) {
      setExpandedCount((c) => c + 1);
    } else {
      setExpandedCount((c) => Math.max(c - 1, 0));
    }
    setTreeStatusOverride(null as unknown as overrideMessage);
  };

  const generateKey = (node: any) => {
    let key: string;
    switch (type.s) {
      case 'sample':
        key = node.sample_id;
        break;
      case 'portion':
        key = node.portion_id;
        break;
      case 'aliquot':
        key = node.aliquot_id;
        break;
      case 'slide':
        key = node.slide_id;
        break;
      case 'analyte':
        key = node.analyte_id;
        break;
      default:
        key = '';
    }
    return key;
  };
  return (
    <ul className="my-2">
      <li>
        <UnstyledButton
          onClick={onTreeClick}
          className="flex gap-1 ml-2 w-full"
          aria-expanded={isExpanded.current}
        >
          {isExpanded.current ? (
            <CollapsedNodeIcon
              className="cursor-pointer text-accent-vivid self-center"
              size={18}
            />
          ) : (
            <ExpandNodeIcon
              className="cursor-pointer text-accent-vivid self-center"
              size={18}
            />
          )}

          <span
            className={`border border-base-lighter border-l-6 border-l-accent-vivid
            font-medium py-1 text-xs w-full pl-4 uppercase text-primary cursor-pointer`}
          >
            <Highlight search={query} text={type.p} />
          </span>
        </UnstyledButton>
      </li>
      {isExpanded.current &&
        entities?.hits?.edges?.map((entity) => (
          <Node
            entity={entity.node}
            entityTypes={entityTypes}
            key={generateKey(entity.node)}
            type={type}
            selectedEntity={selectedEntity}
            selectEntity={selectEntity}
            query={query}
          >
            <BioTree
              entityTypes={entityTypes}
              parentNode={entity?.node && (entity.node.submitter_id as any)}
              selectedEntity={selectedEntity}
              selectEntity={selectEntity}
              setTreeStatusOverride={setTreeStatusOverride}
              treeStatusOverride={treeStatusOverride}
              setExpandedCount={setExpandedCount}
              setTotalNodeCount={setTotalNodeCount}
              search={search}
              query={query}
              type={type}
            />
          </Node>
        ))}
    </ul>
  );
};
