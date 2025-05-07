import Image from "next/image";
import { Toaster } from "@/components/ui/sonner"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container mx-auto">
        <Image src={"/shapeone.png"} width={200} height={200} alt={""} />
        <div className="">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
