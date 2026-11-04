package com.example.atgv;
import java.nio.file.*;import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication public class Application{
 public static void main(String[] args)throws Exception{Files.createDirectories(Path.of("data"));SpringApplication.run(Application.class,args);}
}
