describe('Arrays Should be Observable - TaskManagerElement', () => {
  let taskManager;

  beforeEach(async () => {
    taskManager = document.createElement('task-manager-component');
    document.body.appendChild(taskManager);
    await window.customElements.whenDefined('task-manager-component');
    await taskManager.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  afterEach(() => {
    document.body.removeChild(taskManager);
  });

  it('should add tasks correctly', () => {
    taskManager.addTask('Test task');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Test task');
  });

  it('should remove the first task correctly', () => {
    taskManager.addTask('Test task 1');
    taskManager.addTask('Test task 2');
    taskManager.removeFirstTask();
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Test task 2');
  });

  it('should remove the last task correctly', () => {
    taskManager.addTask('Test task 1');
    taskManager.addTask('Test task 2');
    taskManager.removeLastTask();
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Test task 1');
  });

  it('should add task to the front correctly', () => {
    taskManager.addTask('Test task 1');
    taskManager.addTaskToFront('Test task 2');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(2);
    expect(taskItems[0].textContent).toContain('Test task 2');
  });

  it('should remove task at a specific index correctly', () => {
    taskManager.addTask('Test task 1');
    taskManager.addTask('Test task 2');
    taskManager.removeTask(0);
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Test task 2');
  });

  it('should replace task at a specific index correctly', () => {
    taskManager.addTask('Test task 1');
    taskManager.replaceTask(0, 'Replaced task');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Replaced task');
  });

  it('should sort tasks correctly', () => {
    taskManager.addTask('b');
    taskManager.addTask('a');
    taskManager.sortTasks();
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems[0].textContent).toContain('a');
    expect(taskItems[1].textContent).toContain('b');
  });

  it('should reverse tasks correctly', () => {
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    taskManager.reverseTasks();
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems[0].textContent).toContain('Task 2');
    expect(taskItems[1].textContent).toContain('Task 1');
  });

  it('should fill tasks correctly', () => {
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    taskManager.fillTasks('Filled task');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems[0].textContent).toContain('Filled task');
    expect(taskItems[1].textContent).toContain('Filled task');
  });

  it('should copy within tasks correctly', () => {
    taskManager.addTask('Task 1');
    taskManager.addTask('Task 2');
    taskManager.addTask('Task 3');
    taskManager.copyWithinTasks(0, 1, 2);
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems[0].textContent).toContain('Task 2');
    expect(taskItems[1].textContent).toContain('Task 2');
    expect(taskItems[2].textContent).toContain('Task 3');
  });
});
