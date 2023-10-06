import { Button } from "@/components/ui/button";

export default function Home({ title = "" }) {
  return (
    <main className="mx-10  lg:mx-24">
      <div className="grid col-span-6 bg-blue-500 py-12 px-8 lg:col-span-12">
        <h2 className="pb-2 text-3xl font-semibold   text-white text-wrap col-span-4">
          You snap it! You sell it
        </h2>
      </div>
    </main>
  );
}
