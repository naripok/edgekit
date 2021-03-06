import * as reducers from './reducers';
import * as matchers from './matchers';
import { queryMatches } from './filters';
import {
  PageView,
  EngineCondition,
  AudienceDefinitionFilter,
} from '../../types';

export const evaluateCondition = (
  condition: EngineCondition<AudienceDefinitionFilter>,
  pageViews: PageView[]
): boolean => {
  const { filter, rules } = condition;

  const filteredPageViews = filter.queries.flatMap((query) =>
    pageViews.filter((pageView) => {
      const pageFeatures = pageView.features[query.queryProperty];
      return queryMatches(query, pageFeatures);
    })
  );

  return rules.every((rule) => {
    // TODO: allow other reducers...
    //     // const reducer = reducers[rule.reducer.name](rule.reducer.args);
    const reducer = reducers[rule.reducer.name]();
    const value = reducer(filteredPageViews);
    const matches = matchers[rule.matcher.name](rule.matcher.args);

    return matches(value);
  });
};
