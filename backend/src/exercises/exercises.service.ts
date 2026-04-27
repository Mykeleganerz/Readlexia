import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise, ExerciseType } from './exercise.entity';
import { ExerciseQuestion } from './exercise-question.entity';
import { Document } from '../documents/document.entity';
import { GenerateExerciseDto } from './dto/generate-exercise.dto';
import { SubmitExerciseAnswerDto } from './dto/submit-answer.dto';

@Injectable()
export class ExercisesService {
    constructor(
        @InjectRepository(Exercise)
        private exercisesRepository: Repository<Exercise>,
        @InjectRepository(ExerciseQuestion)
        private questionsRepository: Repository<ExerciseQuestion>,
        @InjectRepository(Document)
        private documentsRepository: Repository<Document>,
    ) { }

    /**
     * Extract unique words from document content
     */
    private extractWords(content: string, minLength: number = 3): string[] {
        if (!content) return [];

        const words = content
            .toLowerCase()
            .match(/\b[a-z]+\b/g)
            ?.filter((word) => word.length >= minLength) ?? [];

        // Remove duplicates and sort by frequency
        const wordFreq = {};
        words.forEach((word) => {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        });

        return Object.keys(wordFreq).sort(
            (a, b) => wordFreq[b] - wordFreq[a],
        );
    }

    /**
     * Get phonemes from a word (simplified approach)
     */
    private getPhonemes(word: string): string[] {
        // Simplified phoneme extraction - in production, use a phoneme dictionary
        const vowels = 'aeiou';
        const phonemes = [];
        let current = '';

        for (let i = 0; i < word.length; i++) {
            current += word[i];

            // Check if next character is a vowel and current contains a consonant
            if (i + 1 < word.length) {
                const nextIsVowel = vowels.includes(word[i + 1]);
                const currentHasVowel = [...current].some((c) => vowels.includes(c));

                if (nextIsVowel && currentHasVowel) {
                    phonemes.push(current);
                    current = '';
                }
            }
        }

        if (current) phonemes.push(current);

        return phonemes.length > 0 ? phonemes : word.split('');
    }

    /**
     * Generate phoneme segmentation exercise
     */
    private generatePhonemeSegmentation(
        word: string,
    ): Partial<ExerciseQuestion> {
        const phonemes = this.getPhonemes(word);
        const phonemesStr = phonemes.join(' / ');

        return {
            type: ExerciseType.PHONEME_SEGMENTATION,
            question: `What are the sounds in the word "${word.toUpperCase()}"?`,
            options: [
                phonemesStr,
                phonemes.slice(0, -1).join(' / '),
                phonemes.slice(1).join(' / '),
                (phonemes[0] + ' ' + phonemes.slice(1).join('/')).trim(),
            ],
            correctAnswer: phonemesStr,
            explanation: `The word "${word}" is broken into these sounds: ${phonemesStr}`,
            sourceWord: word,
        };
    }

    /**
     * Generate letter-sound tracing exercise
     */
    private generateLetterSoundTracing(
        word: string,
    ): Partial<ExerciseQuestion> {
        const firstLetter = word[0].toUpperCase();
        const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const shuffled = allLetters
            .filter((l) => l !== word[0])
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const options = [firstLetter, ...shuffled.map((l) => l.toUpperCase())]
            .sort(() => Math.random() - 0.5);

        return {
            type: ExerciseType.LETTER_SOUND_TRACING,
            question: `What is the first letter of "${word}"? Trace it: ______`,
            options: options,
            correctAnswer: firstLetter,
            explanation: `The first letter of "${word}" is "${firstLetter}".`,
            sourceWord: word,
        };
    }

    /**
     * Generate sound blending exercise
     */
    private generateSoundBlending(word: string): Partial<ExerciseQuestion> {
        const phonemes = this.getPhonemes(word);
        const phonemesStr = phonemes.join(' / ');

        // Generate wrong answers
        const wrongAnswers = [];
        wrongAnswers.push(word.split('').reverse().join('')); // Reversed
        wrongAnswers.push(word.slice(1) + word[0]); // First letter moved to end

        const options = [word, ...wrongAnswers]
            .filter((_, i) => i < 4)
            .sort(() => Math.random() - 0.5);

        return {
            type: ExerciseType.SOUND_BLENDING,
            question: `Blend these sounds together: ${phonemesStr} = ?`,
            options: options.map((opt) => opt.toUpperCase()),
            correctAnswer: word.toUpperCase(),
            explanation: `When you blend ${phonemesStr}, you get "${word.toUpperCase()}".`,
            sourceWord: word,
        };
    }

    /**
     * Generate letter discrimination exercise
     */
    private generateLetterDiscrimination(
        word: string,
    ): Partial<ExerciseQuestion> {
        const positionToReplace = Math.floor(Math.random() * word.length);
        const correctLetter = word[positionToReplace];
        let wordWithMissing = word.substring(0, positionToReplace) + '?' + word.substring(positionToReplace + 1);

        // Generate similar looking letters
        const similarLetters = this.getSimilarLetters(correctLetter);
        const options = [correctLetter, ...similarLetters]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);

        return {
            type: ExerciseType.LETTER_DISCRIMINATION,
            question: `What letter goes in place of "?" in: ${wordWithMissing.toUpperCase()}?`,
            options: options,
            correctAnswer: correctLetter,
            explanation: `The correct letter is "${correctLetter.toUpperCase()}". The word is "${word.toUpperCase()}".`,
            sourceWord: word,
        };
    }

    /**
     * Get similar-looking letters (common for dyslexia)
     */
    private getSimilarLetters(letter: string): string[] {
        const similarMap = {
            b: ['d', 'p', 'q'],
            d: ['b', 'p', 'q'],
            p: ['b', 'd', 'q'],
            q: ['b', 'd', 'p'],
            m: ['n', 'w'],
            n: ['m', 'w'],
            u: ['v', 'w'],
            v: ['u', 'w'],
            w: ['m', 'n', 'u', 'v'],
            a: ['e', 'o'],
            e: ['a', 'c', 'o'],
            l: ['i', '1'],
            i: ['l', '1', 'j'],
            s: ['5', 'z'],
            z: ['s', '2'],
        };

        return similarMap[letter.toLowerCase()] || ['a', 'e', 'i'];
    }

    /**
     * Generate syllable types exercise
     */
    private generateSyllableTypes(word: string): Partial<ExerciseQuestion> {
        const syllableType = this.determineSyllableType(word);

        return {
            type: ExerciseType.SYLLABLE_TYPES,
            question: `What syllable pattern does "${word.toUpperCase()}" have?`,
            options: [
                syllableType,
                'Open',
                'Vowel Team',
                'Controlled R',
                'Closed',
                'Silent E',
            ]
                .filter((v, i, a) => a.indexOf(v) === i)
                .sort(() => Math.random() - 0.5)
                .slice(0, 4),
            correctAnswer: syllableType,
            explanation: `"${word}" follows the ${syllableType} syllable pattern.`,
            sourceWord: word,
        };
    }

    /**
     * Determine syllable type
     */
    private determineSyllableType(word: string): string {
        const vowels = 'aeiou';
        word = word.toLowerCase();

        // Simple heuristics
        if (word.endsWith('e') && word.length > 2) {
            return 'Silent E';
        }
        if (word.match(/[aeiou]{2}/)) {
            return 'Vowel Team';
        }
        if (word.match(/[aeiou]r[^aeiou]?$/)) {
            return 'Controlled R';
        }
        if (word.match(/[^aeiou][aeiou][^aeiou]$/)) {
            return 'Closed';
        }
        if (word.match(/[^aeiou][aeiou]$/)) {
            return 'Open';
        }

        return 'Closed';
    }

    /**
     * Generate rapid automatized naming exercise
     */
    private generateRapidNaming(word: string): Partial<ExerciseQuestion> {
        return {
            type: ExerciseType.RAPID_NAMING,
            question: `Say this word as fast as you can: ${word.toUpperCase()}`,
            options: [word.toUpperCase()],
            correctAnswer: word.toUpperCase(),
            explanation: `Good job! You correctly identified "${word}". Processing speed is improving!`,
            sourceWord: word,
        };
    }

    /**
     * Create exercise questions of random types
     */
    private createExerciseQuestions(
        words: string[],
        numberOfExercises: number,
    ): Partial<ExerciseQuestion>[] {
        const questions: Partial<ExerciseQuestion>[] = [];
        const exerciseTypes = [
            ExerciseType.PHONEME_SEGMENTATION,
            ExerciseType.LETTER_SOUND_TRACING,
            ExerciseType.SOUND_BLENDING,
            ExerciseType.LETTER_DISCRIMINATION,
            ExerciseType.SYLLABLE_TYPES,
            ExerciseType.RAPID_NAMING,
        ];

        for (let i = 0; i < numberOfExercises; i++) {
            const word = words[i % words.length];
            const exerciseType = exerciseTypes[i % exerciseTypes.length];

            let question: Partial<ExerciseQuestion>;

            switch (exerciseType) {
                case ExerciseType.PHONEME_SEGMENTATION:
                    question = this.generatePhonemeSegmentation(word);
                    break;
                case ExerciseType.LETTER_SOUND_TRACING:
                    question = this.generateLetterSoundTracing(word);
                    break;
                case ExerciseType.SOUND_BLENDING:
                    question = this.generateSoundBlending(word);
                    break;
                case ExerciseType.LETTER_DISCRIMINATION:
                    question = this.generateLetterDiscrimination(word);
                    break;
                case ExerciseType.SYLLABLE_TYPES:
                    question = this.generateSyllableTypes(word);
                    break;
                case ExerciseType.RAPID_NAMING:
                    question = this.generateRapidNaming(word);
                    break;
                default:
                    question = this.generatePhonemeSegmentation(word);
            }

            questions.push(question);
        }

        return questions;
    }

    /**
     * Generate exercise from document
     */
    async generateExercise(
        userId: number,
        generateExerciseDto: GenerateExerciseDto,
    ): Promise<Exercise> {
        const { documentId, numberOfExercises } = generateExerciseDto;

        // Validate input
        if (numberOfExercises < 1 || numberOfExercises > 50) {
            throw new BadRequestException('Number of exercises must be between 1 and 50');
        }

        // Get document
        const document = await this.documentsRepository.findOne({
            where: { id: documentId, userId },
        });

        if (!document) {
            throw new NotFoundException('Document not found');
        }

        // Extract words
        const words = this.extractWords(document.content);

        if (words.length === 0) {
            throw new BadRequestException('Document contains no valid words for exercises');
        }

        // Generate questions
        const questionsData = this.createExerciseQuestions(
            words,
            numberOfExercises,
        );

        // Create exercise
        const exercise = this.exercisesRepository.create({
            documentId,
            userId,
            exerciseTypes: [
                ExerciseType.PHONEME_SEGMENTATION,
                ExerciseType.LETTER_SOUND_TRACING,
                ExerciseType.SOUND_BLENDING,
                ExerciseType.LETTER_DISCRIMINATION,
                ExerciseType.SYLLABLE_TYPES,
                ExerciseType.RAPID_NAMING,
            ],
            totalQuestions: numberOfExercises,
            correctAnswers: 0,
            attemptedQuestions: 0,
            completed: false,
        });

        // Save exercise first
        const savedExercise = await this.exercisesRepository.save(exercise);

        // Create and save questions
        const questionsWithExerciseId = questionsData.map((q) => ({
            ...q,
            exerciseId: savedExercise.id,
        }));

        await this.questionsRepository.save(questionsWithExerciseId);

        // Reload exercise with questions
        return this.exercisesRepository.findOne({
            where: { id: savedExercise.id },
            relations: ['questions'],
        });
    }

    /**
     * Get exercise by ID
     */
    async getExercise(exerciseId: number, userId: number): Promise<Exercise> {
        const exercise = await this.exercisesRepository.findOne({
            where: { id: exerciseId, userId },
            relations: ['questions'],
        });

        if (!exercise) {
            throw new NotFoundException('Exercise not found');
        }

        return exercise;
    }

    /**
     * Submit answer for a question
     */
    async submitAnswer(
        exerciseId: number,
        userId: number,
        submitAnswerDto: SubmitExerciseAnswerDto,
    ): Promise<ExerciseQuestion> {
        const { questionId, userAnswer } = submitAnswerDto;

        // Get exercise to verify ownership
        const exercise = await this.exercisesRepository.findOne({
            where: { id: exerciseId, userId },
        });

        if (!exercise) {
            throw new NotFoundException('Exercise not found');
        }

        // Get question
        const question = await this.questionsRepository.findOne({
            where: { id: questionId, exerciseId },
        });

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        // Check answer
        const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

        // Update question
        question.userAnswer = userAnswer;
        question.isCorrect = isCorrect;

        await this.questionsRepository.save(question);

        // Update exercise stats
        exercise.attemptedQuestions += 1;
        if (isCorrect) {
            exercise.correctAnswers += 1;
        }

        if (exercise.attemptedQuestions === exercise.totalQuestions) {
            exercise.completed = true;
        }

        await this.exercisesRepository.save(exercise);

        return question;
    }

    /**
     * Get all exercises for a user
     */
    async getUserExercises(userId: number, limit: number = 10): Promise<Exercise[]> {
        return this.exercisesRepository.find({
            where: { userId },
            relations: ['document', 'questions'],
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    /**
     * Get exercise statistics
     */
    async getExerciseStats(exerciseId: number, userId: number): Promise<any> {
        const exercise = await this.getExercise(exerciseId, userId);

        return {
            totalQuestions: exercise.totalQuestions,
            attemptedQuestions: exercise.attemptedQuestions,
            correctAnswers: exercise.correctAnswers,
            scorePercentage: exercise.getScorePercentage(),
            completed: exercise.completed,
            createdAt: exercise.createdAt,
        };
    }
}
