import { UserDatabase } from "../data/UserDatabase";
import { CustomError, InvalidEmail, InvalidName, InvalidPassword, Unauthorized, UserNotFound } from "../error/customError";
import {
  UserInputDTO,
  user,
  EditUserInputDTO,
  EditUserInput,
  LoginInputDTO,
} from "../model/user";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenGenerator } from "../services/TokenGenerator";

const idGenerator = new IdGenerator()
const tokenGenerator = new TokenGenerator()
const userDatabase = new UserDatabase();
const hashManager = new HashManager()

export class UserBusiness {
  public createUser = async (input: UserInputDTO): Promise<string> => {
    try {
      const { name, email, password } = input;

      if (!name || !email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos "name","nickname", "email" e "password"'
        );
      }

      if (name.length < 4) {
        throw new InvalidName();
      }

      if (email.length < 6) {
        throw new InvalidName();
      }

      if (email === email) {
        throw new InvalidEmail();
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }



      const id: string = idGenerator.generateId()

      const hashPassword: string = await hashManager.generateHash(password)

      const user: user = {
        id,
        name,
        email,
        password: hashPassword
      };
   
      await userDatabase.insertUser(user);
      const token = tokenGenerator.generateToken(id)

      return token
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public login = async (input: LoginInputDTO): Promise<string> => {
    try {
      const { email, password } = input;
    
      if (!email || !password) {
        throw new CustomError(
          400,
          'Preencha os campos"email" e "password"'
        );
      }

      if (!email.includes("@")) {
        throw new InvalidEmail();
      }

      const user = await userDatabase.findUser(email);

      if (!user) {
        throw new UserNotFound()
      }

      const compareResult: boolean = await hashManager.compareHash(password, user.password)

      if(!compareResult){ 
        throw new InvalidPassword()
      }

      const token = tokenGenerator.generateToken(user.id)
     
      return token
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  // public editUser = async (input: EditUserInputDTO) => {
  //   try {
  //     const { name, nickname, id, token } = input;

  //     if (!name || !nickname || !id || !token) {
  //       throw new CustomError(
  //         400,
  //         'Preencha os campos "id", "name", "nickname" e "token"'
  //       );
  //     }

  //     const data = tokenGenerator.tokenData(token)

  //     if(!data.id) {
  //       throw new Unauthorized()
  //     }

  //     if (name.length < 4) {
  //       throw new InvalidName();
  //     }

  //     const editUserInput: EditUserInput = {
  //       id,
  //       name,
  //       nickname,
  //     };

  //     const userDatabase = new UserDatabase();
  //     await userDatabase.editUser(editUserInput);
  //   } catch (error: any) {
  //     throw new CustomError(400, error.message);
  //   }
  // };
}
