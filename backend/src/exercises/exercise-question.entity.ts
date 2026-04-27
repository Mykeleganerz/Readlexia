import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity('exercise_questions')
export class ExerciseQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Exercise, (exercise) => exercise.questions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'exerciseId' })
    exercise: Exercise;

    @Column()
    exerciseId: number;

    @Column()
    type: string; // phoneme_segmentation, letter_sound_tracing, etc.

    @Column()
    question: string; // The question/prompt text

    @Column('simple-array')
    options: string[]; // For multiple choice questions

    @Column()
    correctAnswer: string;

    @Column({ nullable: true })
    userAnswer: string;

    @Column({ default: false })
    isCorrect: boolean;

    @Column({ type: 'text', nullable: true })
    explanation: string; // Feedback explanation

    @Column()
    sourceWord: string; // Original word from document
}
