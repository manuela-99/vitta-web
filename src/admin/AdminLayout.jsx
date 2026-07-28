import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminLayout() {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header__inner">
          <div className="admin-header__brand">
            <Link to="/admin" className="admin-header__title">
              Vitta - Panel
            </Link>
            <p className="admin-header__subtitle">Pedidos</p>
          </div>
          <button type="button" className="admin-header__logout" onClick={handleSignOut}>
            Cerrar sesion
          </button>
        </div>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
