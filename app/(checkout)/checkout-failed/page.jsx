import Header from "@/app/components/Header";

export default function Page({ searchParams }) {
  const { checkout_id } = searchParams;
  return (
    <main className="">
      <Header />
      <div className="flex justify-center items-center w-full py-72">
        <h1 className="text-red-600 text-xl">Checkout Failed</h1>
      </div>
    </main>
  );
}
