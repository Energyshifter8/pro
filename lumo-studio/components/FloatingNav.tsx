import Dock from "./overlays/Dock";
import MenuOverlay from "./overlays/MenuOverlay";
import ContactModal from "./overlays/ContactModal";
import RegisterModal from "./overlays/RegisterModal";

// Floating dock plus the overlays it opens (menu, contact modal, olympiad register modal).
export default function FloatingNav() {
  return (
    <>
      <Dock />
      <MenuOverlay />
      <ContactModal />
      <RegisterModal />
    </>
  );
}
