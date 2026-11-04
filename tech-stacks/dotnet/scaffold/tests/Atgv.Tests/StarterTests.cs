using Xunit;
public class StarterTests { [Fact] public void TaskCanBeCreated(){var task=new TaskItem{Title="Example"};Assert.Equal("Example",task.Title);} }
