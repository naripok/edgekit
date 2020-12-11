import {
  AudienceDefinition,
  EngineCondition,
  EngineConditionQuery,
} from '../../types';

/*
 * I'm maintaining the union over the translation layer
 * so the compiler can discriminate it further bellow in the computation
 * TODO Better audienceDefinition validation
 */
export const translate = (
  audienceDefinition: AudienceDefinition
): EngineCondition[] => {

  const {
    filterComparisonType,
    value,
    featureVersion,
    queryProperty
  } = audienceDefinition.definition;

  return [{
    filter: {
      queries: [
        {
          version: featureVersion,
          property: queryProperty,
          filterComparisonType,
          value,
        } as EngineConditionQuery,
      ]
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
  }];
};
