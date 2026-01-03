import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import './styles/reset.css';
import './styles/variables.css';
import './styles/global.css';

function App() {
  const pathname = window.location.pathname;

  return (
    <>
      {pathname === '/sign-up' ? (
        <SignUpPage />
      ) : pathname === '/dashboard' ? (
        <DashboardPage />
      ) : pathname === '/profile' ? (
        <ProfilePage />
      ) : (
        <SignInPage />
      )}
    </>
  );
}

export default App;
