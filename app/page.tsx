import Image from "next/image";
import { Button } from "@/components/ui/button";
import shapeone from "@/public/shapeone.png";
import undraw from "@/public/undraw.png";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Image src={shapeone} alt={""} />
      <div className="flex justify-center mx-auto mt-20">
        <Image src={undraw} alt={""} />
      </div>
      
      <section>
        <div className="text-center my-20 mx-auto max-w-2xs">
          <h2 className="font-bold text-lg">Gets things with TODs</h2>
          <p className="my-5">
            Lorem ipsum dolor sit amet consectetur. Eget sit nec et euismod. Consequat urna quam felis interdum quisque. Malesuada adipiscing tristique ut eget sed.
          </p>
        </div>
      </section>

      <div className="flex justify-center mx-auto max-w-md mb-20">
        <div className="mx-4 w-full">
          <Button className="py-6 bg-[#50C2C9] w-full text-lg font-semibold transition-all cursor-pointer hover:bg-[#50c3c9ba]">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
