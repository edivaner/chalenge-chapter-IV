import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { app } from '../../../../app';


let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create a new user", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  test("should be able to create a new user", async () => {

    const requestUser = await request(app).post("/users").send({
      name: "User Teste",
      email: "teste@teste.com",
      password: "1234",
    });

    expect(requestUser.status).toBe(201);
  });

})
