import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import './index.css'
import App from './App.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Home from './components/Home.jsx'
import AuthContextProvider from './contexts/AuthContextProvider.jsx'
import DashBoard from './components/DashBoard.jsx'
import DashBoardLayout from './components/DashBoardLayout.jsx'
import DashContextProvider from './contexts/DashContextProvider.jsx'
import Expense from './components/Expense.jsx'
import ListExpenses from "./components/ListExpenses.jsx"
import Category from './components/Category.jsx'
import Budget from './components/Budget.jsx'
import BudgetList from './components/BudgetList.jsx'
import BudgetAnalysis from './components/BudgetAnalysis.jsx'
import Profile from './components/Profile.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'home',
        element: <Home />
      }
    ]
  },
  {
    path: '/',
    element: <DashBoardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashBoard />
      },
      {
        path: 'expenses',
        element: <Expense />
      },
      {
        path: 'list',
        element: <ListExpenses />
      },
      {
        path: 'category',
        element: <Category />
      },
      {
        path: "budget",
        element: <Budget />
      },
      {
        path: "budgetlist",
        element: <BudgetList />
      },
      {
        path: "analyse/budget/:budgetId",
        element: <BudgetAnalysis />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <DashContextProvider>
      <RouterProvider router={router} />
    </DashContextProvider>
  </AuthContextProvider>
)
