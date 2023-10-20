"use client";

import React, { useEffect, useState } from "react";

function Page({ params }: { params: { id: string } }) {
  return (
    <main className="grid grid-cols-6">
      <h2 className="max-w-[200px] pb-2 text-3xl font-semibold tracking-tight transition-colors text-blue-500 my-8">
        Dashboard
      </h2>
    </main>
  );
}

export default Page;
