import { IsNumber, Min, Max, IsOptional } from 'class-validator';

export class GenerateExerciseDto {
    @IsNumber()
    documentId: number;

    @IsNumber()
    @Min(1)
    @Max(50)
    numberOfExercises: number;

    @IsOptional()
    @IsNumber({}, { each: true })
    exerciseTypes?: string[];
}
