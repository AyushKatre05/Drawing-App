import React, { useEffect, useRef, useState } from "react";

const App = () => {
  const [color, setColor] = useState("red");
  const [width, setWidth] = useState(10);
  const [opacity, setOpacity] = useState(0.4);
  const [drawing, setDrawing] = useState(false);
  const [eraserEnabled, setEraserEnabled] = useState(false);
  const [eraserSize, setEraserSize] = useState(10);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.globalAlpha = opacity;
    context.strokeStyle = color;
    context.lineWidth = width;
    contextRef.current = context;
  }, [color, opacity, width]);

  const start = (e) => {
    if (eraserEnabled) {
      setDrawing(true);
    } else {
      contextRef.current.beginPath();
      contextRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setDrawing(true);
    }
  };

  const end = () => {
    if (eraserEnabled) {
      setDrawing(false);
    } else {
      contextRef.current.closePath();
      setDrawing(false);
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    if (!eraserEnabled) {
      contextRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      contextRef.current.stroke();
    } else {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      const eraserWidth = parseInt(eraserSize);
      const halfEraserWidth = Math.floor(eraserWidth / 2);

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.clearRect(x - halfEraserWidth, y - halfEraserWidth, eraserWidth, eraserWidth);
    }
  };

  const toggleEraser = () => {
    setEraserEnabled(!eraserEnabled);
  };

  const handleEraserSizeChange = (e) => {
    setEraserSize(e.target.value);
  };

  return (
    <>
      <div className="text-center text-5xl w-full font-extrabold text-green-600 bg-slate-800 p-2 mb-8">
        Drawing App
      </div>
      <div className="grid grid-cols-2 mx-10 mb-8 md:mx-12 lg:mx-16 justify-center items-center gap-5 text-xl font-bold">
        <label htmlFor="brush">Brush Color : 
        <input onChange={(e) => setColor(e.target.value)} type="color" />
        </label>
        <label htmlFor="width">Width : 
        <input
          onChange={(e) => setWidth(e.target.value)}
          type="range"
          min="3"
          max="30"
        />
        </label>
        <label htmlFor="opacity">Opacity :
        <input
          onChange={(e) => setOpacity(e.target.value)}
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
        />
         </label>
        <div className="flex flex-col md:flex-row lg:flex-row gap-4">
        <button className="bg-red-500 text-white w-48 rounded-lg p-2 hover:bg-red-700" onClick={toggleEraser}>{eraserEnabled ? "Disable Eraser" : "Enable Eraser"}</button>
        {eraserEnabled && (
          <>
            <label htmlFor="eraserSize">Eraser Size : 
            <input
              onChange={handleEraserSizeChange}
              type="range"
              min="5"
              max="50"
              value={eraserSize}
            />
            </label>
          </>
        )}
        </div>
      </div>
      <canvas
        className="border-black border-[10px] mx-auto w-[90vw] h-[70vh]"
        ref={canvasRef}
        onMouseDown={start}
        onMouseUp={end}
        onMouseMove={draw}
      ></canvas>
    </>
  );
};

export default App;
