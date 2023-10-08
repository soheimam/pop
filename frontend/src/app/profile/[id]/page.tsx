function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "profile");

  return (
    <main>
      <h1> profile</h1>
    </main>
  );
}

export default Page;
