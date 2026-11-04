package com.example.atgv;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController public class TaskController{
 private final TaskRepository repo;public TaskController(TaskRepository repo){this.repo=repo;}
 @GetMapping("/api/health") public Map<String,String> health(){return Map.of("status","ok","database","sqlite");}
 @GetMapping("/health") public String legacyHealth(){return "ok";}
 @GetMapping("/api/tasks") public List<TaskItem> all(){return repo.findAll();}
 @GetMapping("/api/tasks/{id}") public ResponseEntity<TaskItem> find(@PathVariable Long id){return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());}
 @PostMapping("/api/tasks") public ResponseEntity<?> create(@RequestBody TaskInput data){
  if(data.title()==null||data.title().isBlank()||data.title().length()>200)return ResponseEntity.badRequest().body("invalid title");
  return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(new TaskItem(data.title().trim())));
 }
 @PutMapping("/api/tasks/{id}") public ResponseEntity<?> update(@PathVariable Long id,@RequestBody TaskInput data){
  if(data.title()==null||data.title().isBlank())return ResponseEntity.badRequest().build();
  return repo.findById(id).map(task->{task.title=data.title().trim();return ResponseEntity.ok(repo.save(task));}).orElse(ResponseEntity.notFound().build());
 }
 @DeleteMapping("/api/tasks/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){
  if(!repo.existsById(id))return ResponseEntity.notFound().build();repo.deleteById(id);return ResponseEntity.noContent().build();
 }
 public record TaskInput(String title){}
}
