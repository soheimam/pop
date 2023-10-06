import Image from "next/image";

interface CarCardProps {
  imageUrl: string;
  make: string;
  model: string;
  year: number;
  price: number;
}

const CarCard: React.FC<CarCardProps> = ({
  imageUrl,
  make,
  model,
  year,
  price,
}) => {
  return (
    <div className="bg-blue-100 rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={`${make} ${model}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{`${make} ${model}`}</h2>
        <p className="text-blue-900">{`${year} | $${price}`}</p>
      </div>
    </div>
  );
};

export default CarCard;
