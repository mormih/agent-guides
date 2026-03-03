# Rule: Offline-First Architecture

**Priority**: P1 — Mobile apps must be functional without network connectivity.

1. **Optimistic UI required**: User actions update the UI immediately without waiting for network.
2. **Network state awareness**: Every screen requiring network data handles offline state with clear UI feedback, not blank screens.
3. **Sync conflict resolution**: Defined conflict resolution strategy must exist and be documented.
4. **Queue persistence**: Outgoing action queue must be persisted to disk (not memory) to survive app termination.
5. **Background sync**: Queued actions synced when connectivity restored, including when app is backgrounded.
6. **Stale data disclosure**: Cached data older than SLA for that data type must be labeled "Last updated X ago."
