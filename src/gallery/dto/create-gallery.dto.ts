import { IsNotEmpty, IsString } from "class-validator";

export class CreateGalleryDto {
    @IsNotEmpty()
    @IsString()
    title: string;
}