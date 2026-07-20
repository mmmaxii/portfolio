import SkyScene from "@/components/scene/SkyScene";
import MobileLayout from "@/components/mobile/MobileLayout";

export default function Home() {
  return (
    <>
      <div className="desktop-only">
        <SkyScene />
      </div>
      <div className="mobile-only">
        <MobileLayout />
      </div>
    </>
  );
}
