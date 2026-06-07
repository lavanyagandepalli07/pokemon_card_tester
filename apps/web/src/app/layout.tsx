import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'PokéAuth — AI Pokemon Card Authentication',
  description:
    'Authenticate and identify your Pokemon cards instantly with AI-powered scanning. Get OCR extraction, reference matching, and authenticity analysis.',
  keywords: ['pokemon', 'card authentication', 'AI', 'OCR', 'grading'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
