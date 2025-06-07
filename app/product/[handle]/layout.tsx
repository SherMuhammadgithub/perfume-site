import Footer from "components/layout/footer";
import { ReactNode } from "react";

export default function ProductLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-10">{children}</div>
      <Footer />
    </>
  );
}
