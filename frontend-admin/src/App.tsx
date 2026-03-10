import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import MainLayout from '@/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import UsersPage from '@/pages/UsersPage';
import CategoriesPage from '@/pages/CategoriesPage';
import ProductsPage from '@/pages/ProductsPage';
import OrdersPage from '@/pages/OrdersPage';
import InquiriesPage from '@/pages/InquiriesPage';
import NewsPage from '@/pages/NewsPage';
import TagsPage from '@/pages/TagsPage';
import MoodQuestionsPage from '@/pages/MoodQuestionsPage';
import { paths } from '@/routes/paths';

export default function App() {
  return (
    <Routes>
      <Route path={paths.login} element={<LoginPage />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path={paths.users.slice(1)} element={<UsersPage />} />
        <Route path={paths.categories.slice(1)} element={<CategoriesPage />} />
        <Route path={paths.products.slice(1)} element={<ProductsPage />} />
        <Route path={paths.orders.slice(1)} element={<OrdersPage />} />
        <Route path={paths.inquiries.slice(1)} element={<InquiriesPage />} />
        <Route path={paths.news.slice(1)} element={<NewsPage />} />
        <Route path={paths.tags.slice(1)} element={<TagsPage />} />
        <Route path={paths.moodQuestions.slice(1)} element={<MoodQuestionsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
