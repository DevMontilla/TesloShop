import { Size } from "@/interfaces";
import clsx from "clsx";

interface Props {
  selectedSize: Size;
  availableSizes: Size[];
}

export const SizeSelector = ({ selectedSize, availableSizes }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Talles disponibles</h3>

      <div className="flex">
        {availableSizes.map((size) => (
          <button
            className={clsx("mx-2 hover:border-b-2 border-black text-lg", {
              "border-b-2 border-black": size === selectedSize,
            })}
            key={size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
