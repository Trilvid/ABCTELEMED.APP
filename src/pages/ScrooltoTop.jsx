// src/page/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSimpleAutoLogout from "./UseSimpleAutoLogout";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useSimpleAutoLogout(5000)

  return null;
}
