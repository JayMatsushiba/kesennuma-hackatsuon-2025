import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// Root layout required by Next.js 15
// Since we have the `[locale]` segment, we don't duplicate the <html> tag here
export default function RootLayout({ children }: Props) {
  return children;
}
