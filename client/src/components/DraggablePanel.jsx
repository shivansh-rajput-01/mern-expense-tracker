import React, { useRef, useEffect, useContext, useState } from "react";
import dashContext from "../contexts/dashContext";

export default function DraggablePanel() {
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const { setCalc } = useContext(dashContext);
  let [renderState, setRenderState] = useState([
    ["C", "X", "(", "÷"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    [")", "0", ".", "="],
  ]);
  let [actualCalc, setActualCalc] = useState("");
  let [displayCalc, setDisplayCalc] = useState("");

  useEffect(() => {
    const panel = panelRef.current;
    const header = headerRef.current;
    if (!panel || !header) return;

    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    const onPointerDown = (event) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;

      header.setPointerCapture(event.pointerId);

      startX = event.clientX;
      startY = event.clientY;

      const rect = panel.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      panel.style.left = `${initialLeft}px`;
      panel.style.top = `${initialTop}px`;

      const onPointerMove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        const maxX = document.documentElement.clientWidth - panelWidth - 20;
        const maxY = document.documentElement.clientHeight - panelHeight - 20;

        newLeft = Math.max(0, Math.min(newLeft, maxX));
        newTop = Math.max(60, Math.min(newTop, maxY));

        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
      };

      const onPointerUp = (e) => {
        try {
          header.releasePointerCapture(e.pointerId);
        } catch (err) {}

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    };

    header.addEventListener("pointerdown", onPointerDown);

    return () => {
      header.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  function setCalcStateHandler(idx, i) {
    console.log("clicked", renderState[idx][i]);
    let input = renderState[idx][i];
    if(input === "X" || input === "C" || input === "=") {
        if(actualCalc.length === 0) return;
        if(input === "X") {
            setActualCalc(prev => prev.slice(0, prev.length-1));
            setDisplayCalc(prev => prev.slice(0, prev.length-1));
        }
        if(input === "C") {
            setActualCalc("");
            setDisplayCalc("");
        }
        if(input === "=") {
            setActualCalc(String(eval(actualCalc)));
            setDisplayCalc(String(eval(actualCalc)));
        }
        return;
    } 
    setActualCalc((prev) => prev + input);
    setDisplayCalc((prev) => prev + (input === "*"? "x": input));
  }

  return (
    <div
      ref={panelRef}
      className="absolute z-10 top-25 left-0 w-90 bg-white dark:bg-black/90 border border-slate-200 dark:border-slate-800 rounded-sm shadow-xl overflow-hidden"
    >
      <div
        ref={headerRef}
        className="h-2 font-semibold cursor-grab active:cursor-grabbing select-none touch-none transition-colors"
      ></div>
      <div className="p-5 select-text cursor-default font-sans relative text-slate-700">
        <i
          className="fa-solid fa-x absolute top-2 right-2 text-slate-700"
          onClick={() => setCalc(false)}
        ></i>
        <div className="calc">
          <div className="query border border-slate-700 rounded-sm w-[90%] dark:text-white h-15 my-4 bg-slate-50 dark:bg-slate-800 mx-auto text-right px-4 text-2xl">
            {displayCalc}
          </div>
          <div className="options flex flex-wrap gap-4">
            {renderState.map((ele, idx) => (
              <div className="w-[90%] mx-auto h-15 text-black dark:text-white flex justify-between" key={idx}>
                {ele.map((e, i) => (
                  <div
                    className="w-1/5 h-14 flex justify-center items-center rounded-sm shadow-sm bg-slate-50 dark:bg-white/10 text-xl border border-blue-300"
                    key={i} onClick={() => setCalcStateHandler(idx, i)}
                  >
                    {e === "*"? "×": e}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
