import Header from '@/components/Header';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8">{children}</main>
    </div>
  );
};

export default AdminLayout; 