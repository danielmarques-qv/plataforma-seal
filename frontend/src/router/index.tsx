import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '../components/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { OnboardingRouter } from './OnboardingRouter'
import {
  LoginPage,
  WarRoomPage,
  FrontlinePage,
  ArsenalPage,
  TrainingPage,
  CommissionsPage,
} from '../pages'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <OnboardingRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute requiredStep={3}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'war-room',
        element: <WarRoomPage />,
      },
      {
        path: 'frontline',
        element: <FrontlinePage />,
      },
      {
        path: 'arsenal',
        element: <ArsenalPage />,
      },
      {
        path: 'treinamentos',
        element: <TrainingPage />,
      },
      {
        path: 'comissoes',
        element: <CommissionsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
