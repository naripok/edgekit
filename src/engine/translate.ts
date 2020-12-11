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
  return [{
    filter: {
      queries: [
        {
          version: audienceDefinition.definition.featureVersion,
          property: audienceDefinition.definition.queryProperty,
          filterComparisonType: audienceDefinition.definition.queryFilterComparisonType,
          value: audienceDefinition.definition.queryValue,
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
