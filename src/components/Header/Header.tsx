import { useState } from 'react';
import { Link } from 'react-router-dom';
import Search from '../Search/Search';
import styles from './Header.module.scss';

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className={`${styles.header} ${isSearchOpen ? styles.searchOpen : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="dentsu world services, go to home">
          <span className={styles.logoMark} aria-hidden="true">dentsu</span>
          <span className={styles.logoText} aria-hidden="true">world services</span>
        </Link>

        <Search isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
      </div>
    </header>
  );
}

export default Header;