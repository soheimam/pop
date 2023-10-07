function Page({ params }: { params: { id: string } }) {
  // If the car is not found, display a message
  console.log(params);

  return (
    <main>
      <h1> profile</h1>
    </main>
  );
}

export default Page;
