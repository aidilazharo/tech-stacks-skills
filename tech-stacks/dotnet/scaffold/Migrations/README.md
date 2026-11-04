# EF Core migrations
The starter creates its local SQLite schema with `EnsureCreatedAsync()`.
For versioned migrations before production, replace EnsureCreated with `Database.MigrateAsync()` and run:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Review and commit migration source files, never data/app.db.
