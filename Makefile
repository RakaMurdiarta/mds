DataSourcePath = ./libs/commons/src/infra/database/typeormDatasource.ts

# Declare phony targets
.PHONY: gen-migration gen-run

# Generate a new migration
gen-migration:
	@NODE_ENV=$(NODE_ENV) pnpm typeorm migration:generate -d $(DataSourcePath) ./migrations/$(name)

# Run migrations
run-migration:
	@NODE_ENV=$(NODE_ENV) pnpm typeorm migration:run -d $(DataSourcePath)

rollback-migration:
	@NODE_ENV=$(NODE_ENV) pnpm typeorm migration:revert -d $(DataSourcePath)
