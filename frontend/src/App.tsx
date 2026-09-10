import { Provider } from "./context/provider";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from './components/Menu/Menu';
import Landing from "./pages/Landing/Landing";
import Projects from "./pages/Projects/Projects";
import Skills from "./pages/Skills/SkillsContent";
import Equip from "./pages/Equip/Equip";
import MemCardSelector from "./components/MemCardSelector/MemCardSelector";
import Config from "./pages/Config/Config";
import Resume from "./pages/Resume/Resume";
import Contact from "./pages/Contact/Contact";
import NameEntry from "./pages/NameEntry/NameEntry";
import NodeDetails from "./components/NodeDetails/NodeDetails";

const DESIGN_WIDTH = 1200;
const DESIGN_HEIGHT = 975;
const COMPACT_MAX_SIDE = 500;
const COMPACT_DESIGN_HEIGHT = 880;
const canvasHeight = (width: number, height: number) => Math.min(width, height) < COMPACT_MAX_SIDE ? COMPACT_DESIGN_HEIGHT : DESIGN_HEIGHT;

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => setIsLoaded(true), []);
  useEffect(() => {
    function availableHeight() {
      const viewport = window.visualViewport;
      if (viewport && Math.abs(viewport.scale - 1) < 0.01) return viewport.height;
      return document.documentElement.clientHeight;
    }
    function scaleApp() {
      const app = document.getElementById("root");
      if (!app) return;
      const width = document.documentElement.clientWidth;
      const height = availableHeight();
      const canvas = canvasHeight(width, document.documentElement.clientHeight);
      const scale = Math.min(width / DESIGN_WIDTH, height / canvas);
      const bandTop = window.visualViewport?.offsetTop ?? 0;
      const offsetY = bandTop + (height - app.offsetHeight * scale) / 2;
      app.style.transform = `translateX(-50%) translateY(${offsetY}px) scale(${scale})`;
    }
    let settle: ReturnType<typeof setTimeout>;
    const scaleAfterKeyboard = () => { scaleApp(); clearTimeout(settle); settle = setTimeout(scaleApp, 300); };
    const preventGesture = (event: Event) => event.preventDefault();
    const preventPinch = (event: TouchEvent) => { if (event.touches.length > 1) event.preventDefault(); };
    window.addEventListener("load", scaleApp);
    window.addEventListener("resize", scaleApp);
    window.addEventListener("focusin", scaleAfterKeyboard);
    window.addEventListener("focusout", scaleAfterKeyboard);
    window.addEventListener("orientationchange", scaleApp);
    window.visualViewport?.addEventListener("resize", scaleApp);
    window.visualViewport?.addEventListener("scroll", scaleApp);
    document.addEventListener("gesturestart", preventGesture);
    document.addEventListener("gesturechange", preventGesture);
    document.addEventListener("touchmove", preventPinch, { passive: false });
    scaleApp();
    return () => {
      clearTimeout(settle);
      window.removeEventListener("load", scaleApp);
      window.removeEventListener("resize", scaleApp);
      window.removeEventListener("focusin", scaleAfterKeyboard);
      window.removeEventListener("focusout", scaleAfterKeyboard);
      window.removeEventListener("orientationchange", scaleApp);
      window.visualViewport?.removeEventListener("resize", scaleApp);
      window.visualViewport?.removeEventListener("scroll", scaleApp);
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("touchmove", preventPinch);
    };
  }, []);

  return (
    <Provider>
      <div className="flex h-screen" data-active={isLoaded}>
        <div className="w-[1100px] h-[825px] mx-auto my-[5rem] relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/node/:nodeId" element={<NodeRoute />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/equip" element={<Equip />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/history/:historyType?" element={<MemCardSelector />} />
            <Route path="/config" element={<Config />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/name" element={<NameEntry />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Menu />
        </div>
      </div>
    </Provider>
  )
}

function NodeRoute() {
  const path = window.location.pathname.split("/");
  const nodeId = Number(path[path.length - 1]);
  return Number.isFinite(nodeId) ? <NodeDetails nodeId={nodeId} /> : <Navigate to="/" replace />;
}

export default App;
