# Rule: Mobile Performance Budget

**Priority**: P1 — Poor mobile performance directly correlates with abandonment.

## Thresholds

| Metric | Target | Hard Limit |
|:---|:---|:---|
| Cold start | < 2s | < 3s |
| Time to interactive | < 1s after bundle | < 2s |
| JS bundle size | < 2 MB | < 4 MB |
| Memory usage (background) | < 50 MB | < 100 MB |
| Frame rate | 60 fps | 30 fps minimum |

## Constraints

1. **No blocking the JS thread**: Long computations offloaded to native modules or worker threads.
2. **FlatList for all lists**: Never `ScrollView` for lists of unknown length. Use `FlatList` or `FlashList`.
3. **Image optimization**: All images resized to display size before loading. Use `FastImage` for caching.
4. **Hermes engine**: Must be enabled on both platforms.
