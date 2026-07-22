"use client";
import Image from "next/image";

const ArrowDecorative = () => {
  return (
    <div className="relative w-full   z-2">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 max-w-full">
        <Image
          src="/star-mask.svg"
          alt="star mask"
          width={220}
          height={220}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default ArrowDecorative;
