import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/** Chrome for the public-facing website. Internal tools live outside this
 *  route group so they don't inherit the marketing header and footer. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
