
//A rota recebe email e password no corpo da requisição e retorna os dados do usuário autenticado junto à um token JWT.
import { describe, expect, test } from '@jest/globals';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import request from 'supertest';
import { app } from '../../../../app';


let authenticateUser: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUser = new AuthenticateUserUseCase(usersRepository);
  });

  test("should be able to login", async () => {
    const userCreate = {
      name: "User Teste",
      email: "teste@teste.com",
      password: "1234",
    }
    const user = await createUserUseCase.execute(userCreate);

    const retorno = await request(app).post("/sessions").send({
      email: user.email, password: user.password
    });

    expect(retorno.body[0]).toHaveProperty("id");
  });

})
