import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { Document } from '../documents/document.entity';
import { User } from '../users/user.entity';
import { ExerciseQuestion } from './exercise-question.entity';

export enum ExerciseType {
    PHONEME_SEGMENTATION = 'phoneme_segmentation',
    LETTER_SOUND_TRACING = 'letter_sound_tracing',
    SOUND_BLENDING = 'sound_blending',
    LETTER_DISCRIMINATION = 'letter_discrimination',
    SYLLABLE_TYPES = 'syllable_types',
    RAPID_NAMING = 'rapid_naming',
}

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Document, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'documentId' })
    document: Document;

    @Column()
    documentId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @Column('simple-array')
    exerciseTypes: ExerciseType[];

    @Column()
    totalQuestions: number;

    @Column({ default: 0 })
    correctAnswers: number;

    @Column({ default: 0 })
    attemptedQuestions: number;

    @Column({ default: false })
    completed: boolean;

    @OneToMany(() => ExerciseQuestion, (question) => question.exercise, {
        cascade: true,
        eager: true,
    })
    questions: ExerciseQuestion[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Helper method to calculate score percentage
    getScorePercentage(): number {
        if (this.attemptedQuestions === 0) return 0;
        return Math.round((this.correctAnswers / this.attemptedQuestions) * 100);
    }
}
