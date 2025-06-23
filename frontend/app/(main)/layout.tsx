import Header from '@/components/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '40px auto', padding: 24 }}>{children}</main>
    </div>
  );
} 