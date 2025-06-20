import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll, vi } from 'vitest';
import '../src/taskManager.js';

describe("Arrays Should be Observable - TaskManagerElement", () => {
  let taskManager;

  beforeEach(async () => {
    taskManager = document.createElement("task-manager-component");
    document.body.appendChild(taskManager);
    await window.customElements.whenDefined("task-manager-component");
    await taskManager.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  afterEach(() => {
    document.body.removeChild(taskManager);
  });

  function getTaskText(element) {
    return element.textContent.replace('Remove', '').trim();
  }

  function getTaskTexts() {
    return Array.from(taskManager.querySelectorAll("li")).map(getTaskText);
  }

  it("should add tasks correctly", () => {
    taskManager.addTask("Test task");
    expect(getTaskTexts()).toEqual(["Test task"]);
  });

  it("should remove the first task correctly", () => {
    taskManager.addTask("Test task 1");
    taskManager.addTask("Test task 2");
    taskManager.removeFirstTask();
    expect(getTaskTexts()).toEqual(["Test task 2"]);
  });

  it("should remove the last task correctly", () => {
    taskManager.addTask("Test task 1");
    taskManager.addTask("Test task 2");
    taskManager.removeLastTask();
    expect(getTaskTexts()).toEqual(["Test task 1"]);
  });

  it("should add task to the front correctly", () => {
    taskManager.addTask("Test task 1");
    taskManager.addTaskToFront("Test task 2");
    expect(getTaskTexts()).toEqual(["Test task 2", "Test task 1"]);
  });

  it("should remove task at a specific index correctly", () => {
    taskManager.addTask("Test task 1");
    taskManager.addTask("Test task 2");
    taskManager.addTask("Test task 3");
    taskManager.removeTask(1);
    expect(getTaskTexts()).toEqual(["Test task 1", "Test task 3"]);
  });

  it("should replace task at a specific index correctly", () => {
    taskManager.addTask("Test task 1");
    taskManager.addTask("Test task 2");
    taskManager.replaceTask(0, "Replaced task");
    expect(getTaskTexts()).toEqual(["Replaced task", "Test task 2"]);
  });

  it("should sort tasks correctly", () => {
    taskManager.addTask("c");
    taskManager.addTask("a");
    taskManager.addTask("b");
    taskManager.sortTasks();
    expect(getTaskTexts()).toEqual(["a", "b", "c"]);
  });

  it("should reverse tasks correctly", () => {
    taskManager.addTask("Task 1");
    taskManager.addTask("Task 2");
    taskManager.addTask("Task 3");
    taskManager.reverseTasks();
    expect(getTaskTexts()).toEqual(["Task 3", "Task 2", "Task 1"]);
  });

  it("should fill tasks correctly", () => {
    taskManager.addTask("Task 1");
    taskManager.addTask("Task 2");
    taskManager.addTask("Task 3");
    taskManager.fillTasks("Filled task");
    expect(getTaskTexts()).toEqual(["Filled task", "Filled task", "Filled task"]);
  });

  it("should copy within tasks correctly", () => {
    taskManager.addTask("Task 1");
    taskManager.addTask("Task 2");
    taskManager.addTask("Task 3");
    taskManager.addTask("Task 4");
    taskManager.copyWithinTasks(0, 2, 4);
    expect(getTaskTexts()).toEqual(["Task 3", "Task 4", "Task 3", "Task 4"]);
  });

  it("should handle multiple operations correctly", () => {
    taskManager.addTask("Task 1");
    taskManager.addTask("Task 2");
    taskManager.addTaskToFront("Task 3");
    taskManager.removeLastTask();
    taskManager.replaceTask(0, "New Task");
    taskManager.addTask("Task 4");
    taskManager.sortTasks();
    expect(getTaskTexts()).toEqual(["New Task", "Task 1", "Task 4"]);
  });

  it("should render the correct number of tasks", () => {
    taskManager.addTask("Task 1");
    taskManager.addTask("Task 2");
    taskManager.addTask("Task 3");
    const taskItems = taskManager.querySelectorAll("li");
    expect(taskItems.length).toBe(3);
  });

  it("should render remove buttons for each task", () => {
    taskManager.addTask("Task 1");
    taskManager.addTask("Task 2");
    const removeButtons = taskManager.querySelectorAll("li a");
    expect(removeButtons.length).toBe(2);
    expect(removeButtons[0].textContent).toBe("Remove");
    expect(removeButtons[1].textContent).toBe("Remove");
  });
});