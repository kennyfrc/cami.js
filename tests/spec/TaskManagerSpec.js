describe('TaskManagerElement', () => {
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

  it('should add tasks and render them correctly', () => {
    taskManager.addTask('Test task');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Test task');
  });

  it('should remove tasks and update the rendering', () => {
    taskManager.addTask('Test task');
    taskManager.removeTask(0);
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(0);
  });

  it('should toggle task completion status and update the rendering', () => {
    taskManager.addTask('Test task');
    taskManager.toggleTask(0);
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems[0].querySelector('input[type="checkbox"]').checked).toBe(true);
  });

  it('should filter tasks and update the rendering', () => {
    taskManager.addTask('Completed task');
    taskManager.addTask('Active task');
    taskManager.toggleTask(0);
    taskManager.setFilter('completed');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Completed task');
  });

  it('should display tasks based on the selected filter', () => {
    taskManager.addTask('Completed task');
    taskManager.addTask('Active task');
    taskManager.toggleTask(0);
    taskManager.setFilter('completed');
    const taskItems = taskManager.querySelectorAll('li');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Completed task');
  });
});
