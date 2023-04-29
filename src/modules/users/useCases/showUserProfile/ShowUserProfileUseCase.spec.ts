import request from 'supertest';
import { app } from '../../../../app';
import { describe, expect, test } from '@jest/globals';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';

let authenticateUser: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Show user", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUser = new AuthenticateUserUseCase(usersRepository);
  });

  test("should be able show user profile", async () => {
    const user = {
      name: "User Teste",
      email: "teste@teste.com",
      password: "1234",
    }
    await createUserUseCase.execute(user);
    const retorno = await authenticateUser.execute({
      email: user.email, password: user.password
    });

    const userToken = await usersRepository.findById(retorno.token);

    const retornoUser = await request(app).get("/profile").send({}).set({
      Authorization: `Bearer ${retorno.token}`
    });

    expect(retornoUser.body[0]).toHaveProperty("id");
    expect(retornoUser.body[0]).toHaveProperty("name");
    expect(retornoUser.body[0]).toHaveProperty("email");
    expect(retornoUser.body[0]).toHaveProperty("password");
  });

})
