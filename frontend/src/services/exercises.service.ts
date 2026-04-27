import apiClient from './api.service';

export interface ExerciseQuestion {
    id: number;
    type: string;
    question: string;
    options: string[];
    correctAnswer: string;
    userAnswer?: string;
    isCorrect?: boolean;
    explanation: string;
    sourceWord: string;
}

export interface Exercise {
    id: number;
    documentId: number;
    userId: number;
    exerciseTypes: string[];
    totalQuestions: number;
    correctAnswers: number;
    attemptedQuestions: number;
    completed: boolean;
    questions: ExerciseQuestion[];
    createdAt: string;
    updatedAt: string;
}

export interface ExerciseStats {
    totalQuestions: number;
    attemptedQuestions: number;
    correctAnswers: number;
    scorePercentage: number;
    completed: boolean;
    createdAt: string;
}

export const exercisesService = {
    /**
     * Generate exercise from document
     */
    async generateExercise(
        documentId: number,
        numberOfExercises: number,
    ): Promise<Exercise> {
        const response = await apiClient.post('/exercises/generate', {
            documentId,
            numberOfExercises,
        });
        return response.data;
    },

    /**
     * Get exercise by ID
     */
    async getExercise(exerciseId: number): Promise<Exercise> {
        const response = await apiClient.get(`/exercises/${exerciseId}`);
        return response.data;
    },

    /**
     * Submit answer for a question
     */
    async submitAnswer(
        exerciseId: number,
        questionId: number,
        userAnswer: string,
    ): Promise<ExerciseQuestion> {
        const response = await apiClient.post(`/exercises/${exerciseId}/submit`, {
            questionId,
            userAnswer,
        });
        return response.data;
    },

    /**
     * Get exercise statistics
     */
    async getExerciseStats(exerciseId: number): Promise<ExerciseStats> {
        const response = await apiClient.get(`/exercises/${exerciseId}/stats`);
        return response.data;
    },

    /**
     * Get all user exercises
     */
    async getUserExercises(): Promise<Exercise[]> {
        const response = await apiClient.get('/exercises');
        return response.data;
    },
};
