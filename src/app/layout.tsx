import type { Metadata } from 'next';
import { COLORS } from '@/lib/designTokens';

export const metadata: Metadata = {
  title: 'Système Solaire 3D — Explorateur Interactif',
  description: 'Un système solaire 3D interactif avec planètes texturées, orbites animées et informations détaillées.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: ${COLORS.bgSpace};
            font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: ${COLORS.textPrimary};
          }

          #__next {
            width: 100%;
            height: 100%;
          }

          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Scrollbar styling for info panel */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
          }

          ::-webkit-scrollbar-thumb {
            background: ${COLORS.accentPrimary};
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: ${COLORS.textPrimary};
          }

          /* Firefox scrollbar */
          * {
            scrollbar-color: ${COLORS.accentPrimary} rgba(0, 0, 0, 0.3);
            scrollbar-width: thin;
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
