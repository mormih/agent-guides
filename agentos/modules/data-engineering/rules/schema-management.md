# Rule: Schema Management

**Priority**: P0 — Breaking changes cause immediate downstream failures.

## Breaking Changes (require migration plan)

- Renaming or dropping a column
- Changing column data type to incompatible type
- Adding NOT NULL column without default value
- Changing partition keys

## Safe Changes

- Adding new nullable columns
- New tables
- New partitions

## Constraints

1. **Contract versioning**: Tables consumed by external systems versioned during migrations (`orders_v1`, `orders_v2`). Old version maintained ≥ 30 days.
2. **Schema registry for streaming**: All Kafka topics must have schemas in Confluent Schema Registry or AWS Glue. Producers validate before publishing.
