package com.example.atgv;
import jakarta.persistence.*;
@Entity @Table(name="tasks") public class TaskItem{
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String title;
 @Column(nullable=false) public String status="todo";
 public TaskItem(){} public TaskItem(String title){this.title=title;}
}
