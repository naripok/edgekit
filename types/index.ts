export interface Edkt {
  run: () => Promise<void>;
}

// Storage Keys Enum

export enum StorageKeys {
  PAGE_VIEWS = 'edkt_page_views',
  MATCHED_AUDIENCES = 'edkt_matched_audiences',
  MATCHED_AUDIENCE_IDS = 'edkt_matched_audience_ids',
  CACHED_AUDIENCES = 'edkt_cached_audiences',
  CACHED_AUDIENCE_META_DATA = 'edkt_cached_audience_meta_data',
}

// Page Features

export type PageFeatureValue = string[] | number[];

export type PageFeatureResult = {
  version: number;
  value: PageFeatureValue;
};

export interface PageFeatureGetter {
  name: string;
  func: () => Promise<PageFeatureResult>;
}

export type PageFeature =
  | {
      name: string;
      error: true;
    }
  | {
      name: string;
      error: false;
      version: number;
      value: PageFeatureValue;
    };

export interface PageView {
  ts: number;
  target?: boolean;
  keyHash?: string;
  features: Record<string, PageFeatureResult>;
}

// Audiences

export interface MatchedAudience {
  id: string;
  matchedAt: number;
  expiresAt: number;
  matchedOnCurrentPageView: boolean;
}

export type StringArrayQueryValue = string[];
export type VectorQueryValue = {
  vector: number[];
  threshold: number;
};

export type AudienceState = 'live' | 'paused' | 'deleted';

export enum QueryFilterComparisonType {
  VECTOR_DISTANCE = 'vectorDistance',
  COSINE_SIMILARITY = 'cosineSimilarity',
  ARRAY_INTERSECTS = 'arrayIntersects',
}

export interface VectorDistanceFilter {
  queryValue: VectorQueryValue[];
  queryFilterComparisonType: QueryFilterComparisonType.VECTOR_DISTANCE;
}

export interface CosineSimilarityFilter {
  queryValue: VectorQueryValue[];
  queryFilterComparisonType: QueryFilterComparisonType.COSINE_SIMILARITY;
}

export interface ArrayIntersectsFilter {
  queryValue: StringArrayQueryValue;
  queryFilterComparisonType: QueryFilterComparisonType.ARRAY_INTERSECTS;
}

export type AudienceDefinitionDefinition = {
  featureVersion: number;
  ttl: number;
  lookBack: number;
  occurrences: number;
  queryProperty: string;
} & (VectorDistanceFilter | CosineSimilarityFilter | ArrayIntersectsFilter)

export interface AudienceDefinition {
  accountId?: Record<string, AudienceState>;
  id: string;
  version: number;
  name: string;
  cacheFor?: number;
  definition: AudienceDefinitionDefinition
}

export interface CachedAudienceMetaData {
  cachedAt: number;
  audiences: AudienceMetaData[];
}

export interface AudienceMetaData {
  id: string;
  version: number;
}

// Engine

export type EngineConditionQueryArrayIntersectsFilter = {
  filterComparisonType: QueryFilterComparisonType.ARRAY_INTERSECTS;
  value: StringArrayQueryValue;
}

export type EngineConditionQueryVectorDistanceFilter = {
  filterComparisonType: QueryFilterComparisonType.VECTOR_DISTANCE;
  value: VectorQueryValue[];
}

export type EngineConditionQueryCosineSimilarityFilter = {
  filterComparisonType: QueryFilterComparisonType.COSINE_SIMILARITY;
  value: VectorQueryValue[];
}

export type EngineConditionQuery = {
  version: number;
  property: string;
} & (EngineConditionQueryCosineSimilarityFilter | EngineConditionQueryVectorDistanceFilter | EngineConditionQueryArrayIntersectsFilter)

export interface EngineConditionRule {
  reducer: {
    name: 'count';
  };
  matcher: {
    name: 'eq' | 'gt' | 'lt' | 'ge' | 'le';
    args: number;
  };
}

export interface EngineCondition {
  filter: {
    any?: boolean;
    queries: EngineConditionQuery[];
  };
  rules: EngineConditionRule[];
}

export interface PingResponse {
  gdprApplies?: boolean;
}

export interface TCData {
  gdprApplies?: boolean;

  eventStatus: 'tcloaded' | 'cmpuishown' | 'useractioncomplete';

  cmpStatus: 'stub' | 'loading' | 'loaded' | 'error';

  /**
   * If this TCData is sent to the callback of addEventListener: number,
   * the unique ID assigned by the CMP to the listener function registered
   * via addEventListener.
   * Others: undefined.
   */
  listenerId?: number | undefined;

  vendor: {
    consents: { [vendorId: number]: boolean | undefined };
  };
}

export interface ConsentStatus {
  eventStatus: 'tcloaded' | 'useractioncomplete' | 'cmpuishown';
  hasConsent: boolean;
}

declare global {
  interface Window {
    __tcfapi(
      command: 'addEventListener',
      version: number,
      cb: (tcData: TCData, success: boolean) => void
    ): void;

    __tcfapi(
      command: 'removeEventListener',
      version: number,
      cb: (success: boolean) => void,
      listenerId: number
    ): void;
  }
}
