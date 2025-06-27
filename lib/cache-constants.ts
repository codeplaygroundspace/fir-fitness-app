export const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const CACHE_KEYS = {
  TRAINING_DAYS: 'training-days-cache',
  RECOVER_DAYS: 'recover-days-cache',
  MOBILISE_EXERCISES: 'mobilise-exercises',
  USER_LIMITATIONS: 'user-limitations',
  STRETCH_EXERCISES: 'stretch-exercises',
  BODY_MUSCLES: 'body-muscles',
  USER_DAY_EXERCISES: 'user-day-exercises',
} as const
