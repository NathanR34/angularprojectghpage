
export interface TriviaData {
    type: string,
    difficulty: string,
    category: string,
    question: string
}

export interface ResponseCodeApiResponse {
    response_code: number
}

export interface Trivia extends TriviaData {
    correct_answer: string,
    incorrect_answers: string[]
}

export interface TriviaApiResponse extends ResponseCodeApiResponse {
    results?: Trivia[]
}

export interface TriviaCategory {
    id: number,
    name: string
}

export interface TriviaCategoryApiResponse {
    trivia_categories: TriviaCategory[]
}

export interface TriviaCategoryCount {
    total_question_count: number,
    total_easy_question_count: number,
    total_medium_question_count: number,
    total_hard_question_count: number
}

export interface TriviaCategoryCountApiResponse {
    category_id: number,
    category_question_count: TriviaCategoryCount
}

export interface TriviaGlobalQuestionCount {
    total_num_of_questions: number,
    total_num_of_pending_questions: number,
    total_num_of_verified_questions: number,
    total_num_of_rejected_questions: number
}

export interface TriviaGlobalQuestionCountApiResponse {
    overall: TriviaGlobalQuestionCount,
    categories: {
        [key: string | number]: TriviaGlobalQuestionCount
    }
}

export interface Answer {
    answer: string
}

export interface TriviaApiTokenResponse extends ResponseCodeApiResponse {
    response_message: string,
    token: string
}

export interface TriviaApiTokenResetResponse extends ResponseCodeApiResponse {
    token?: string
}
