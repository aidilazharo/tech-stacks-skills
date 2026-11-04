# Spring Boot — Access & Testing Manual

1. `mvn dependency:resolve` prepares Maven dependencies.
2. `mvn spring-boot:run` runs the API at http://127.0.0.1:8080.
3. `curl http://127.0.0.1:8080/api/health` tests API and SQLite wiring.
4. Open http://127.0.0.1:8080/api/docs for Swagger UI.
5. `curl http://127.0.0.1:8080/api/tasks` queries JPA records.
6. `sqlite3 data/app.db "SELECT id,title,status FROM tasks;"` queries SQLite.
7. `mvn test` and `mvn package` validate the application.

ORM: Spring Data JPA / Hibernate SQLite community dialect; review versioned migrations before production.
