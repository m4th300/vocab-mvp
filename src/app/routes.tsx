import { lazy } from 'react';

export const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
export const CardsListPage = lazy(() => import('@/features/cards/CardsList'));

export const QuizLauncherPage = lazy(() => import('@/features/quiz/QuizLauncher'));
export const QuizRunQCMPage = lazy(() => import('@/features/quiz/QuizQCM'));
export const QuizRunReversePage = lazy(() => import('@/features/quiz/QuizReverseQCM'));
export const QuizRunTypingPage = lazy(() => import('@/features/quiz/QuizTyping'));
export const QuizResultPage = lazy(() => import('@/features/quiz/QuizResult'));
