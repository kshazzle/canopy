import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <div className="relative z-10">
        <Navbar />
      </div>
      <Hero />
    </>
  );
}
