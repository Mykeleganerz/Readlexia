import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Request,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { GenerateExerciseDto } from './dto/generate-exercise.dto';
import { SubmitExerciseAnswerDto } from './dto/submit-answer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('exercises')
@UseGuards(JwtAuthGuard)
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @Post('generate')
    async generateExercise(
        @Request() req,
        @Body() generateExerciseDto: GenerateExerciseDto,
    ) {
        return this.exercisesService.generateExercise(req.user.userId, generateExerciseDto);
    }

    @Get(':id')
    async getExercise(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return this.exercisesService.getExercise(id, req.user.userId);
    }

    @Post(':id/submit')
    async submitAnswer(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() submitAnswerDto: SubmitExerciseAnswerDto,
    ) {
        return this.exercisesService.submitAnswer(id, req.user.userId, submitAnswerDto);
    }

    @Get(':id/stats')
    async getExerciseStats(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
    ) {
        return this.exercisesService.getExerciseStats(id, req.user.userId);
    }

    @Get()
    async getUserExercises(@Request() req) {
        return this.exercisesService.getUserExercises(req.user.userId);
    }
}
