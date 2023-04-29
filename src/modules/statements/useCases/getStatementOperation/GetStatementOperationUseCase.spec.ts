
import { describe, expect, test } from '@jest/globals';
import request from "supertest";
import { AuthenticateUserUseCase } from '../../../users/useCases/authenticateUser/AuthenticateUserUseCase';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { app } from '../../../../app';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let authenticateUser: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatement: CreateStatementUseCase;

describe("Show statement", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUser = new AuthenticateUserUseCase(usersRepository);
    createStatement = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  interface IRequest {
    user_id: string;
  }

  test("should be able list statements for id", async () => {
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

    const balance = await (await request(app).get(`statements/${1}`)).header({
    }).set({
      Authorization: `Bearer ${retorno.token}`
    });

    expect(balance.body[0]).toHaveProperty("id");
    expect(balance.body[0]).toHaveProperty("description");
    expect(balance.body[0]).toHaveProperty("amount");
  });

})
