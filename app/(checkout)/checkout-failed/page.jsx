export default function Page({ searchParams }) {
  const { checkout_id } = searchParams;
  return (
    <main className="p-8">
      <h1>Checkout Failed :{checkout_id}</h1>
    </main>
  );
}
