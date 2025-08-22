const {login} = require("../services/authService")

describe("Login Service", () => {
  const mockRepo = {
    findByEmail: jest.fn(),
  };

  it("deve falhar se o usuário não existe", async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(login("a@a.com", "123", mockRepo))
      .rejects
      .toThrow("Usuário não encontrado");
  });

  it("deve retornar token se credenciais corretas", async () => {
    mockRepo.findByEmail.mockResolvedValue({
      id: 1,
      email: "a@a.com",
      password: await require("bcrypt").hash("123", 10),
    });

    const result = await login("a@a.com", "123", mockRepo);
    expect(result).toHaveProperty("token");
  });
});
