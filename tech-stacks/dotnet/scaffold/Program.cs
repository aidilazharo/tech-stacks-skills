using Microsoft.EntityFrameworkCore;
var builder=WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://127.0.0.1:5111");
Directory.CreateDirectory("data");
builder.Services.AddDbContext<AppDbContext>(o=>o.UseSqlite("Data Source=data/app.db"));
builder.Services.AddEndpointsApiExplorer();builder.Services.AddSwaggerGen();
var app=builder.Build();
using(var scope=app.Services.CreateScope()){await scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreatedAsync();}
app.UseSwagger();app.UseSwaggerUI();app.MapGet("/api/docs",()=>Results.Redirect("/swagger"));
app.MapGet("/health",()=>Results.Ok(new{status="ok",database="sqlite"}));
app.MapGet("/api/health",()=>Results.Ok(new{status="ok",database="sqlite"}));
app.MapGet("/api/tasks",async(AppDbContext db)=>await db.Tasks.AsNoTracking().ToListAsync());
app.MapGet("/api/tasks/{id:int}",async(int id,AppDbContext db)=>await db.Tasks.FindAsync(id) is TaskItem task?Results.Ok(task):Results.NotFound());
app.MapPost("/api/tasks",async(TaskInput data,AppDbContext db)=>{
 if(string.IsNullOrWhiteSpace(data.Title)||data.Title.Length>200)return Results.BadRequest("invalid title");
 var task=new TaskItem{Title=data.Title.Trim(),Status="todo",CreatedAt=DateTimeOffset.UtcNow,UpdatedAt=DateTimeOffset.UtcNow};
 db.Tasks.Add(task);await db.SaveChangesAsync();return Results.Created($"/api/tasks/{task.Id}",task);
});
app.MapPut("/api/tasks/{id:int}",async(int id,TaskInput data,AppDbContext db)=>{
 var task=await db.Tasks.FindAsync(id);if(task is null)return Results.NotFound();
 if(string.IsNullOrWhiteSpace(data.Title)||data.Title.Length>200)return Results.BadRequest("invalid title");
 task.Title=data.Title.Trim();task.UpdatedAt=DateTimeOffset.UtcNow;await db.SaveChangesAsync();return Results.Ok(task);
});
app.MapDelete("/api/tasks/{id:int}",async(int id,AppDbContext db)=>{
 var task=await db.Tasks.FindAsync(id);if(task is null)return Results.NotFound();db.Tasks.Remove(task);await db.SaveChangesAsync();return Results.NoContent();
});
app.Run();
public record TaskInput(string Title);
public class TaskItem {public int Id{get;set;}public string Title{get;set;}="";public string Status{get;set;}="todo";public DateTimeOffset CreatedAt{get;set;}public DateTimeOffset UpdatedAt{get;set;}}
public class AppDbContext(DbContextOptions<AppDbContext> opts):DbContext(opts){public DbSet<TaskItem> Tasks=>Set<TaskItem>();}
