import {
  AudienceDefinition,
  EngineCondition,
  EngineConditionQuery,
} from '../../types';

export const translate = (
  audienceDefinition: AudienceDefinition
): EngineCondition[] => {
  const query: EngineConditionQuery = {
    featureVersion: audienceDefinition.definition.featureVersion,
    queryProperty: audienceDefinition.definition.queryProperty,
    queryFilterComparisonType:
      audienceDefinition.definition.queryFilterComparisonType,
    queryValue: audienceDefinition.definition.queryValue,
  };
  const condition: EngineCondition = {
    filter: {
      queries: [query],
    },
    rules: [
      {
        reducer: {
          name: 'count',
        },
        matcher: {
          name: 'gt',
          args: audienceDefinition.definition.occurrences,
        },
      },
    ],
  };

  return [condition];
};
