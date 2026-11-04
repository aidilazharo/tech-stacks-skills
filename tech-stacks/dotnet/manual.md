# .NET — Access & Testing Manual

1. `dotnet restore` downloads .NET 10 SDK dependencies.
2. `dotnet run` starts API at http://127.0.0.1:5111.
3. `curl http://127.0.0.1:5111/api/health` checks health.
4. Open http://127.0.0.1:5111/api/docs for Swagger.
5. `curl http://127.0.0.1:5111/api/tasks` lists EF Core records.
6. `sqlite3 data/app.db "SELECT id,title,status FROM Tasks;"` queries SQLite.
7. `dotnet test tests/Atgv.Tests/Atgv.Tests.csproj` and `dotnet build` verify.

ORM: Entity Framework Core SQLite. See Migrations/README.md for migration setup.
