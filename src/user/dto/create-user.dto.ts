import { IsEmail, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: 'Некорректный формат email' })
    email: string;

    @MaxLength(55, {message: 'Слишком длинный логин'})
    login: string;

    @MinLength(6, {message: 'Слишком короткий пароль. Минимальная длина пароля 6 символов'})
    password: string;
    confirmPassword: string;

    isAdmin?: boolean = false;
}