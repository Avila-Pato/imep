"use client";
import React from "react";
import Image from "next/image";

const ArrowDecorative = () => {
  return (
    <>
    <section
      className="relative "
    
    >
      {/* Star mask centrada en la parte superior */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2">
          <Image
            src="/star-mask.svg"
            alt="star mask"
            width={220}
            height={220}
          />
        </div>
    </section>
    </>
  );
};

export default ArrowDecorative;
