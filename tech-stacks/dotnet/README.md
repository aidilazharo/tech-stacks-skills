# ASP.NET Core + Entity Framework Core + SQLite

Remote starter for .NET 10 REST API with EF Core, health, task CRUD, Swagger and SQLite.
`dotnet restore` → `dotnet test tests/Atgv.Tests/Atgv.Tests.csproj` → `dotnet build` → `dotnet run`

Migrations: starter creates first local SQLite schema; switch to versioned EF Core migration before deployment.
