function Page({ params }: { params: { id: string } }) {
  // If the car is not found, display a message
  console.log(params);
  return <div className="bg-pink-900 text-black">{params.id}</div>;
}

export default Page;
