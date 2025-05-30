# Body Muscle Thumbnail Optimization

## Problem

The `MobiliseExerciseCard` component was fetching body muscle data (including thumbnail images) on every render, causing unnecessary API calls and poor performance. Each exercise card would independently fetch the same muscle data multiple times.

## Solution

Implemented a global caching context (`BodyMuscleProvider`) that:

1. **Caches muscle data globally** - Once a muscle is fetched, it's stored in memory and localStorage
2. **Prevents duplicate requests** - Multiple cards requesting the same muscle won't trigger multiple API calls
3. **Persists across sessions** - Uses localStorage with 24-hour expiration
4. **Follows project patterns** - Uses the same caching strategy as other data in the app

## Implementation Details

### Files Modified/Created:

1. **`lib/cache-constants.ts`** - Added `BODY_MUSCLES` cache key
2. **`contexts/body-muscle-context.tsx`** - New context for managing muscle data
3. **`app/layout.tsx`** - Added `BodyMuscleProvider` to app root
4. **`components/exercises/mobilise-exercise-card.tsx`** - Updated to use context instead of direct fetching

### Key Features:

- **Smart caching**: Uses Map for in-memory storage, converts to plain object for localStorage
- **Loading states**: Tracks which muscles are currently being fetched
- **Error handling**: Graceful fallback if muscle data can't be loaded
- **Automatic fetching**: Triggers fetch when muscle data is requested but not cached
- **24-hour expiration**: Follows project's cache duration standard

## Usage

The optimization is transparent to existing code. The `MobiliseExerciseCard` component now uses:

```tsx
const { getBodyMuscle, isLoading } = useBodyMuscle()
const bodyMuscle = bodyMuscleId ? getBodyMuscle(bodyMuscleId) : null
const isLoadingMuscle = bodyMuscleId ? isLoading(bodyMuscleId) : false
```

Instead of managing its own state and fetch logic.

## Benefits

1. **Performance**: Eliminates redundant API calls
2. **User Experience**: Faster loading of muscle thumbnails
3. **Consistency**: Follows established caching patterns in the app
4. **Maintainability**: Centralized muscle data management
5. **Offline Support**: Works with existing localStorage caching strategy

## Cache Management

The muscle data cache:

- Expires after 24 hours (configurable via `CACHE_DURATION`)
- Can be cleared manually if needed
- Automatically handles serialization/deserialization
- Integrates with existing cache infrastructure
