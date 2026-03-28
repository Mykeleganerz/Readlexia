import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateDocumentDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @IsString({ message: 'Content must be a string' })
  @IsOptional()
  content?: string;

  @IsString({ message: 'Category must be a string' })
  @IsOptional()
  category?: string;
}
