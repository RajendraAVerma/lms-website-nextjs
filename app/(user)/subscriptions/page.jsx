import Header from "@/app/components/Header";
import ListView from "./components/ListView";

export default function Page() {
  return (
    <main className="">
      <Header />
      <div className="p-8 flex flex-col gap-5">
        <h1 className="text-2xl font-semibold">My Subscriptions</h1>
        <ListView />
      </div>
    </main>
  );
}
