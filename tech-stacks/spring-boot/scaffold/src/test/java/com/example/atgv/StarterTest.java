package com.example.atgv;
import org.junit.jupiter.api.Test;import static org.junit.jupiter.api.Assertions.*;
class StarterTest{@Test void modelCreated(){TaskItem item=new TaskItem("Example");assertEquals("Example",item.title);}}
