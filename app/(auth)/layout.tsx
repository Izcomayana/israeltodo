// app/auth/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <main className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
