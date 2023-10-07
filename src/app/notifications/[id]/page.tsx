function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "notifications");

  return (
    <main>
      <h1> Notis</h1>
    </main>
  );
}

export default Page;
