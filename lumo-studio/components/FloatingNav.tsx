import Dock from "./overlays/Dock";
import MenuOverlay from "./overlays/MenuOverlay";
import RegisterModal from "./overlays/RegisterModal";

// Floating dock plus the overlays it opens (menu, register modal).
export default function FloatingNav() {
  return (
    <>
      <Dock />
      <MenuOverlay />
      <RegisterModal />
    </>
  );
}
