'use client';

import Link from 'next/link';
import Header from '@/components/Header';

const HeaderComponent = () => {
  return (
    <header style={{ background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 24, color: '#222', textDecoration: 'none' }}>
          E-Commerce
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;