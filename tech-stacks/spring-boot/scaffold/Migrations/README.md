# SQLite / JPA schema migration

The local starter uses Hibernate `ddl-auto=update` for convenience. **Not suitable for production schema migrations.**
Before production use Flyway or Liquibase and set `spring.jpa.hibernate.ddl-auto=validate`.
Keep versioned migration SQL in `src/main/resources/db/migration/` and commit scripts, not SQLite data files.
