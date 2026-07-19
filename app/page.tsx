import StarMap from "@/components/starmap/StarMap";
import MobileLayout from "@/components/mobile/MobileLayout";

export default function Home() {
  return (
    <>
      <div className="desktop-only">
        <StarMap />
      </div>
      <div className="mobile-only">
        <MobileLayout />
      </div>
    </>
  );
}
