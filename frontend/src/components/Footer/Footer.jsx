// frontend/src/components/Footer/Footer.jsx
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerItem}>
          <span>🔐</span>
          <span>Privado</span>
        </div>
        <div className={styles.footerItem}>
          <span>👥</span>
          <span>Usuarios: admin</span>
        </div>
        <div className={styles.footerItem}>
          <span>🛡️</span>
          <span>Sesión segura</span>
        </div>
        <div className={styles.footerItem}>
          <span>©</span>
          <span>{new Date().getFullYear()} Registro de Motos</span>
        </div>
      </div>
    </footer>
  );
}