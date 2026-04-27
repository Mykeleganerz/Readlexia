import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise } from './exercise.entity';
import { ExerciseQuestion } from './exercise-question.entity';
import { Document } from '../documents/document.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Exercise, ExerciseQuestion, Document])],
    controllers: [ExercisesController],
    providers: [ExercisesService],
    exports: [ExercisesService],
})
export class ExercisesModule { }
