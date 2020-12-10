import { AudienceDefinition, EngineCondition, QueryFilterComparisonType } from '../../types';
import { isStringArray, isVectorQueryValue } from '../utils';

export const translate = (
  audienceDefinition: AudienceDefinition
): EngineCondition[] => {
  const condition: EngineCondition = {
    filter: {
      queries:
        audienceDefinition.definition.queryFilterComparisonType ===
          QueryFilterComparisonType.ARRAY_INTERSECTS &&
        isStringArray(audienceDefinition.definition.queryValue)
          ? [
              {
                version: audienceDefinition.definition.featureVersion,
                property: audienceDefinition.definition.queryProperty,
                filterComparisonType:
                  audienceDefinition.definition.queryFilterComparisonType,
                value: audienceDefinition.definition.queryValue,
              },
            ]
          : audienceDefinition.definition.queryFilterComparisonType ===
              QueryFilterComparisonType.VECTOR_DISTANCE &&
            isVectorQueryValue(audienceDefinition.definition.queryValue)
          ? [
              {
                version: audienceDefinition.definition.featureVersion,
                property: audienceDefinition.definition.queryProperty,
                filterComparisonType:
                  audienceDefinition.definition.queryFilterComparisonType,
                value: audienceDefinition.definition.queryValue,
              },
            ]
          : audienceDefinition.definition.queryFilterComparisonType ===
            QueryFilterComparisonType.COSINE_SIMILARITY &&
          isVectorQueryValue(audienceDefinition.definition.queryValue)
          ? [
              {
                version: audienceDefinition.definition.featureVersion,
                property: audienceDefinition.definition.queryProperty,
                filterComparisonType:
                  audienceDefinition.definition.queryFilterComparisonType,
                value: audienceDefinition.definition.queryValue,
              },
            ]
          : [],
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
