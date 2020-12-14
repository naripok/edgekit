import {
  ArrayIntersectsFilter,
  AudienceDefinitionFilter,
  CosineSimilarityFilter,
  EngineConditionQuery,
  VectorDistanceFilter,
  VectorQueryValue,
  QueryFilterComparisonType,
} from '../../../types';

/* Type Guards */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const isStringArray = (value: any): value is string[] =>
  value instanceof Array && value.every((item) => typeof item === 'string');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const isNumberArray = (value: any): value is number[] =>
  value instanceof Array && value.every((item) => typeof item === 'number');

export const isVectorQueryValue = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  value: any
): value is VectorQueryValue =>
  isNumberArray(value.vector) && typeof value.threshold === 'number';

export const matchArrayIntersectsFilterType = (
  query: EngineConditionQuery<AudienceDefinitionFilter>
): query is EngineConditionQuery<ArrayIntersectsFilter> => {
  return query.queryFilterComparisonType === QueryFilterComparisonType.ARRAY_INTERSECTS
  && isStringArray(query.queryValue)
};

export const matchVectorDistanceFilterType = (
  query: EngineConditionQuery<AudienceDefinitionFilter>
): query is EngineConditionQuery<VectorDistanceFilter> => {
  return query.queryFilterComparisonType === QueryFilterComparisonType.VECTOR_DISTANCE
  && query.queryValue.every(queryValue => isVectorQueryValue(queryValue))
};

export const matchCosineSimilarityFilterType = (
  query: EngineConditionQuery<AudienceDefinitionFilter>
): query is EngineConditionQuery<CosineSimilarityFilter> => {
  return query.queryFilterComparisonType === QueryFilterComparisonType.COSINE_SIMILARITY
  && query.queryValue.every(queryValue => isVectorQueryValue(queryValue))
};
