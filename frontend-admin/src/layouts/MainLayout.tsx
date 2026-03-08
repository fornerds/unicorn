import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/authStore';
import { sitemap, getPageTitle } from '@/routes/sitemap';
import { paths } from '@/routes/paths';

const SIDEBAR_WIDTH = 260;

export default function MainLayout() {
  const pathname = useLocation().pathname;
  const user = useAdminAuthStore((s) => s.user);
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    window.location.href = paths.login;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className="fixed left-0 top-0 z-30 h-full border-r border-gray-200 bg-white"
        style={{ width: SIDEBAR_WIDTH }}
        aria-label="사이드 내비게이션"
      >
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <Link to={paths.dashboard} className="font-bold text-gray-900">
            Unicorn Admin
          </Link>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {sitemap.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col" style={{ marginLeft: SIDEBAR_WIDTH }}>
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle(pathname)}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user?.name ?? user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
