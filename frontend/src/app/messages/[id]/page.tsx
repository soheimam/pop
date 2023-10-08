function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "messages");

  return (
    <main>
      <h1> Messages</h1>
    </main>
  );
}

export default Page;
