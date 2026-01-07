import React, { useEffect, useRef } from 'react';
import Highlight from './Highlight';
import { BioTreeProps, NodeProps, overrideMessage } from './types';
import { UnstyledButton } from '@mantine/core';
import { ArrowRight, CollapsedNodeIcon, ExpandNodeIcon } from '@/utils/icons';

const Node = ({
  entity,
  entityTypes,
  type,
  children,
  selectedEntity,
  selectEntity,
  query,
}: NodeProps): JSX.Element => {
  const idKey = `${type.s}_id`;
  const isSelected =
    selectedEntity && (selectedEntity as any)[idKey] === (entity as any)[idKey];

  return (
    <li className="ml-6">
      {entity?.submitter_id && (
        <div className="flex">
          <span
            className={`w-full flex justify-between text-xs cursor-pointer hover:underline
            hover:font-bold ml-3 mt-1 py-1 px-6 border border-base-lighter ${
              isSelected
                ? 'bg-accent-vivid text-base-max font-bold'
                : 'bg-nci-violet-lightest'
            }
         `}
            onClick={() => selectEntity(entity, type)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') selectEntity(entity, type);
            }}
            role="button"
            tabIndex={0}
          >
            <Highlight search={query} text={entity?.submitter_id || ''} />
            {isSelected && <ArrowRight color="white" size={16} />}
          </span>
        </div>
      )}

      {entityTypes
        .filter((childType) => {
          const childData = (entity as any)[childType.p];
          return Array.isArray(childData) && childData.length > 0;
        })
        .map((childType) =>
          React.cloneElement(children, {
            entities: (entity as any)[childType.p],
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

  useEffect(() => {
    if (query.length > 0) {
      const hasMatch = entities?.some((e) => search(query, e).length > 0);
      const typeMatches = type.p.toLowerCase().includes(query.toLowerCase());

      if (hasMatch || typeMatches) {
        isExpanded.current = true;
        setTreeStatusOverride(overrideMessage.QueryMatches);
      } else {
        isExpanded.current = false;
        setTreeStatusOverride(null);
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
    entities,
    search,
    setExpandedCount,
    type.p,
    setTreeStatusOverride,
  ]);

  useEffect(() => {
    setTotalNodeCount((c) => c + 1);
    return () => {
      setTotalNodeCount((c) => c - 1);
      if (isExpanded.current) {
        setExpandedCount((c) => Math.max(c - 1, 0));
      }
    };
  }, []);

  const onTreeClick = () => {
    if (query) return;
    isExpanded.current = !isExpanded.current;
    if (isExpanded.current) {
      setExpandedCount((c) => c + 1);
    } else {
      setExpandedCount((c) => Math.max(c - 1, 0));
    }
    setTreeStatusOverride(null);
  };

  const generateKey = (node: any) => {
    return (
      node[`${type.s}_id`] || node.submitter_id || Math.random().toString()
    );
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
        entities?.map((entity) => (
          <Node
            entity={entity}
            entityTypes={entityTypes}
            key={generateKey(entity)}
            type={type}
            selectedEntity={selectedEntity}
            selectEntity={selectEntity}
            query={query}
          >
            <BioTree
              entityTypes={entityTypes}
              parentNode={entity?.submitter_id || ''}
              selectedEntity={selectedEntity}
              selectEntity={selectEntity}
              setTreeStatusOverride={setTreeStatusOverride}
              treeStatusOverride={treeStatusOverride}
              setExpandedCount={setExpandedCount}
              setTotalNodeCount={setTotalNodeCount}
              search={search}
              query={query}
              type={type}
              entities={[]}
            />
          </Node>
        ))}
    </ul>
  );
};
