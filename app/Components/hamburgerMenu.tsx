// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';
import styles from './hamburgerMenu.module.css'; 

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.container}>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
        <div className={isOpen ? styles.barOpen : styles.bar}></div>
      </div>
      <nav className={isOpen ? styles.menuOpen : styles.menu}>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/Testpage1">Testpage1</a></li>
          <li><a href="/Testpage2">Testpage2</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;