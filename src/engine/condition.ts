import * as reducers from './reducers';
import * as matchers from './matchers';
import * as filters from './filters';
import {
  PageView,
  PageFeatureResult,
  EngineCondition,
  EngineConditionQuery,
  ArrayIntersectsFilter,
  VectorDistanceFilter,
  CosineSimilarityFilter,
  AudienceDefinitionFilter
} from '../../types';
import {
  isNumberArray,
  isStringArray,
  isArrayIntersectsFilter,
  isVectorDistanceFilter,
  isCosineSimilarityFilter,
} from '../utils';

const createCondition = (condition: EngineCondition<AudienceDefinitionFilter>) =>
  (pageViews: PageView[]): boolean => {
  const { filter, rules } = condition;
  const filteredPageViews = filter.queries
  .map((query) => {
    return pageViews.filter((pageView) => {
      const queryFeatures: PageFeatureResult = pageView.features[query.queryProperty];
      return isArrayIntersectsFilter(query)
        ? checkArrayIntersects(queryFeatures, query)
        : isVectorDistanceFilter(query)
        ? checkVectorDistanceLesserThanThreshold(queryFeatures, query)
        : isCosineSimilarityFilter(query)
        ? checkCosineSimilarityLesserThanThreshold(queryFeatures, query)
        : true;  /* TODO is this right?
                  * Values should only be comparable if
                  * they share the same type, so I would
                  * use a type guard besides the filter guards
                  * to check if value types matches.
                  * However, if they don't, we end up here,
                  * where we return true as in a matching
                  * situation.
                  * Not what I would naively expect.
                  */
    });
  })
  .flat();

  const ruleResults = rules.map((rule) => {
    // TODO: allow other reducers...
    //     // const reducer = reducers[rule.reducer.name](rule.reducer.args);
    const reducer = reducers[rule.reducer.name]();
    const value = reducer(filteredPageViews);
    const matcher = matchers[rule.matcher.name](rule.matcher.args);
    const result = matcher(value);

    return result;
  });

  return !ruleResults.includes(false);
};

export default createCondition;

const checkArrayIntersects =
  (features: PageFeatureResult, query: EngineConditionQuery<ArrayIntersectsFilter>): boolean =>
  !!features &&
  features.version === query.featureVersion &&
  isStringArray(features.value) &&
  filters.arrayIntersects(features.value, query.queryValue);

const checkVectorDistanceLesserThanThreshold =
  (features: PageFeatureResult, query: EngineConditionQuery<VectorDistanceFilter>): boolean =>
  !!features &&
  features.version === query.featureVersion &&
  query.queryValue.some(value =>
                   isNumberArray(features.value) &&
                   filters.vectorDistance(features.value, value));

const checkCosineSimilarityLesserThanThreshold =
  (features: PageFeatureResult, query: EngineConditionQuery<CosineSimilarityFilter>): boolean =>
  !!features &&
  features.version === query.featureVersion &&
  query.queryValue.some(value =>
                   isNumberArray(features.value) &&
                   filters.cosineSimilarity(features.value, value));
