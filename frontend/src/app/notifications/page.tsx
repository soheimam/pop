function Page({ params }: { params: { id: string } }) {
  // If the profile is not found, display a message
  console.log(params, "notifications");

  return (
    <main>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            id={car.id}
            make={car.make}
            model={car.model}
            year={car.year}
            price={car.price}
            imageUrl={car.image}
            engine={car.engine}
          />
        ))}
      </div>
    </main>
  );
}

export default Page;
