// Navbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // read as 'isOpen default false' with setIsOpen to toggle

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gray">
      <div className="container">
        <div className={styles.container}>
          <div className={styles.hamburger} onClick={toggleMenu}>
            <div className={isOpen ? styles.barOpen : styles.bar}></div>
            <div className={isOpen ? styles.barOpen : styles.bar}></div>
            <div className={isOpen ? styles.barOpen : styles.bar}></div>
          </div>
          <nav className={isOpen ? styles.menuOpen : styles.menu}>
            <ul>
              <li>
                <Link href="/" passHref>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/Createblog" passHref>
                  Create New Blog
                </Link>
              </li>
            </ul>
          </nav>

          
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
