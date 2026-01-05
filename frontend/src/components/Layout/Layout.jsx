// frontend/src/components/Layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}