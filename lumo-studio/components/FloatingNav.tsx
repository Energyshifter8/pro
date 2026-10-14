import Dock from "./overlays/Dock";
import MenuOverlay from "./overlays/MenuOverlay";
import RegisterModal from "./overlays/RegisterModal";

export default function FloatingNav() {
  return (
    <>
      <Dock />
      <MenuOverlay />
      <RegisterModal />
    </>
  );
}
