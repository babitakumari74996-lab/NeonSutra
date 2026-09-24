import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Navigate to a homepage section (works from any route, HashRouter-safe). */
export function useSectionNav() {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(
    (id: string) => {
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        navigate("/", { state: { scrollTo: id } });
      }
    },
    [location.pathname, navigate]
  );
}

let whatsappMessage = "";
export function setWhatsAppMessage(msg: string) {
  whatsappMessage = msg;
}
export function getWhatsAppMessage() {
  return whatsappMessage;
}
