package com.example.atgv;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TaskControllerTest {
  @Test void returnsTasksFromRepository() throws Exception {
    TaskRepository repo = mock(TaskRepository.class);
    when(repo.findAll()).thenReturn(List.of(new TaskItem("Sample")));
    MockMvc mvc = MockMvcBuilders.standaloneSetup(new TaskController(repo)).build();
    mvc.perform(get("/api/tasks"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$[0].title").value("Sample"));
  }
}
