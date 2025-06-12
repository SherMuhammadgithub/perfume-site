import Footer from "components/layout/footer";
import { ReactNode } from "react";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-2 py-4">{children}</div>
      <Footer />
    </>
  );
}
