import { IsNumber, IsString } from 'class-validator';

export class SubmitExerciseAnswerDto {
    @IsNumber()
    questionId: number;

    @IsString()
    userAnswer: string;
}
