import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home({ title = "" }) {
  return (
    <main className="mx-10  lg:mx-24">
      <div className="grid grid-cols-6 bg-blue-500 rounded-b-2xl pt-4 pb-12 px-8 lg:grid-cols-12">
        <Image src="/pop_logo.svg" alt="pop logo" width={100} height={50} />
        <h2 className="col-start-1 mt-8 text-3xl font-semibold   text-white text-wrap col-span-4  ">
          You snap it! You sell it
        </h2>
        <p className="col-start-1 col-span-5 leading-7 text-white [&:not(:first-child)]:mt-3 ">
          Snap and sell a varifiable auto marketplace
        </p>
      </div>
      <h4 className="mt-9 mb-6 blue-900 text-xl font-semibold tracking-tight">
        Todays picks
      </h4>
    </main>
  );
}
