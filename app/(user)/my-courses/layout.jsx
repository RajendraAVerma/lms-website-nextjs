import Header from "@/app/components/Header";

export default function Layout({ children }) {
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}
