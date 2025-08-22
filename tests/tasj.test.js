const {createTask} = require('../services/taskService');

describe("Task Service", () => {
  const mockRepo = {
    create: jest.fn(),
  };

  it("deve falhar se não tiver título", async () => {
    await expect(createTask("", 1, mockRepo))
      .rejects
      .toThrow("Título obrigatório");
  });

  it("deve criar uma task válida", async () => {
    mockRepo.create.mockResolvedValue({ id: 1, title: "Estudar", userId: 1, done: false });

    const task = await createTask("Estudar", 1, mockRepo);
    expect(task.title).toBe("Estudar");
    expect(task.done).toBe(false);
  });
});
