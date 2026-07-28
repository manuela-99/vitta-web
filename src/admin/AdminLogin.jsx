import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';

export default function AdminLogin() {
  const { isAuthenticated, loading, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from ?? '/admin';

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await signIn(email.trim(), password);

    if (!result.ok) {
      setError('Credenciales incorrectas. Verific\u00e1 tu email y contrase\u00f1a.');
      setSubmitting(false);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="admin-page admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Acceso privado</p>
        <h1 className="admin-login__title">Vitta - Panel administrativo</h1>
        <p className="admin-login__text">
          {'Ingres\u00e1 con tu cuenta autorizada para ver y gestionar pedidos.'}
        </p>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span className="admin-field__label">Email</span>
            <input
              className="admin-field__input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="admin-field">
            <span className="admin-field__label">{'Contrase\u00f1a'}</span>
            <input
              className="admin-field__input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error ? (
            <p className="admin-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="admin-button admin-button--primary" disabled={submitting}>
            {submitting ? 'Ingresando\u2026' : 'Inici\u00e1 sesi\u00f3n'}
          </button>
        </form>
      </div>
    </div>
  );
}
