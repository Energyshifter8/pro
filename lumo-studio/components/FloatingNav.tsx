import Dock from "./overlays/Dock";
import MenuOverlay from "./overlays/MenuOverlay";
import ContactModal from "./overlays/ContactModal";

// Floating dock plus the overlays it opens (menu, contact modal).
export default function FloatingNav() {
  return (
    <>
      <Dock />
      <MenuOverlay />
      <ContactModal />
    </>
  );
}
