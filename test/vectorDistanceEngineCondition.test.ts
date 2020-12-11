import 'jest';
import { check } from '../src/engine';
import { EngineCondition, QueryFilterComparisonType, VectorDistanceFilter } from '../types';

/* TODO Property based tests for engine behaviors
*/
const vectorCondition: EngineCondition<VectorDistanceFilter> = {
  filter: {
    any: false,
    queries: [
      {
        version: 1,
        property: 'topicDist',
        filterComparisonType: QueryFilterComparisonType.VECTOR_DISTANCE,
        value: [{
          vector: [0.4, 0.8, 0.3],
          threshold: 0.5,
        }],
      },
    ],
  },
  rules: [
    {
      reducer: {
        name: 'count',
      },
      matcher: {
        name: 'ge',
        args: 1,
      },
    },
  ],
};

// Vector condition with a bumped version
const vectorConditionV2: EngineCondition<VectorDistanceFilter> = {
  filter: {
    any: false,
    queries: [
      {
        version: 2,
        property: 'topicDist',
        filterComparisonType: QueryFilterComparisonType.VECTOR_DISTANCE,
        value: [{
          vector: [0.4, 0.8, 0.3],
          threshold: 0.5,
        }],
      },
    ],
  },
  rules: [
    {
      reducer: {
        name: 'count',
      },
      matcher: {
        name: 'ge',
        args: 1,
      },
    },
  ],
};

describe('VectorDistance condition test', () => {
  describe('Vector condition', () => {
    it('matches the page view if similar enough', async () => {
      const conditions = [vectorCondition];

      const pageViews = [
        {
          ts: 100,
          features: {
            topicDist: {
              version: 1,
              value: [0.2, 0.5, 0.1],
            },
          },
        },
      ];

      const result = check(conditions, pageViews);

      expect(result).toEqual(true);
    });

    it('does not match the page view if not similar enough', async () => {
      const conditions = [vectorCondition];

      const pageViews = [
        {
          ts: 100,
          features: {
            topicDist: {
              version: 1,
              value: [0.3, 0.2, 0.1],
            },
          },
        },
        {
          ts: 101,
          features: {
            topicDist: {
              version: 1,
              value: [0.3, 0.2, 0.2],
            },
          },
        },
      ];

      const result = check(conditions, pageViews);

      expect(result).toEqual(false);
    });
  });

  describe('Vector condition with a bumped version', () => {
    it('matches the page view if similar enough and has the same version', async () => {
      const conditions = [vectorConditionV2];

      const pageViews = [
        {
          ts: 100,
          features: {
            topicDist: {
              version: 2,
              value: [0.2, 0.5, 0.1],
            },
          },
        },
      ];

      const result = check(conditions, pageViews);

      expect(result).toBe(true);
    });

    it('does not match the page view if similar enough but does not have the same version', async () => {
      const conditions = [vectorConditionV2];

      const pageViews = [
        {
          ts: 100,
          features: {
            topicDist: {
              version: 1,
              value: [0.2, 0.5, 0.1],
            },
          },
        },
      ];

      const result = check(conditions, pageViews);

      expect(result).toBe(false);
    });
  });
});
