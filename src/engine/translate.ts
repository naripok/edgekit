import {
  AudienceDefinition,
  EngineCondition,
  EngineConditionQuery,
  AudienceDefinitionFilter,
} from '../../types';

/*
 * I'm maintaining the union over the translation layer
 * so the compiler can discriminate it further bellow in the computation
 * TODO Better audienceDefinition validation
 */
export const translate = (
  audienceDefinition: Readonly<Pick<AudienceDefinition, "definition">>
): EngineCondition<AudienceDefinitionFilter>[] => {

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
        } as EngineConditionQuery<AudienceDefinitionFilter>,
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
