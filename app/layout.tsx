import './globals.css'
import SupabaseProvider from "./supabase-provider";

export const metadata = {
  title: "Supabase Flashcard",
  description: "Learn languages with the use of flashcards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
