import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsString({ message: 'Category must be a string' })
  @IsOptional()
  category?: string;
}
