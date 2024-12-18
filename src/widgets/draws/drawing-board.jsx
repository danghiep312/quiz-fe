import React, { useRef, useState, useEffect } from "react";
import { FaBrush, FaEraser, FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

const DrawingBoard = ({ previewImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isEraser, setIsEraser] = useState(false);
  const [eraserSize, setEraserSize] = useState(40);
  const [cursorPos, setCursorPos] = useState(null);
  const [latexResult, setLatexResult] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;

    // Đặt kích thước canvas khớp với thành phần cha
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    setContext(ctx);

    const handleResize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startDrawing = (e) => {
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (isEraser) {
      context.clearRect(
        x - eraserSize / 2,
        y - eraserSize / 2,
        eraserSize,
        eraserSize
      );
    } else {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const saveAsImage = () => {
    const originalCanvas = canvasRef.current;
    const targetWidth = 515;
    const scale = targetWidth / originalCanvas.width; // Tỷ lệ thay đổi kích thước
    const targetHeight = originalCanvas.height * scale;

    // Tạo canvas phụ để chuẩn hóa kích thước
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempContext = tempCanvas.getContext("2d");

    // Vẽ lại nội dung canvas gốc vào canvas mới
    tempContext.fillStyle = "#FFFFFF"; // Đảm bảo nền trắng
    tempContext.fillRect(0, 0, targetWidth, targetHeight);
    tempContext.drawImage(originalCanvas, 0, 0, targetWidth, targetHeight);

    const imageData = tempCanvas
      .toDataURL("image/png")

    previewImage(imageData);
  };

  return (
    <div className="500 flex flex-col items-center overflow-auto bg-gray-100 p-2">
      <div
        className="relative w-full max-w-4xl flex-grow rounded-lg border border-gray-300 bg-white shadow-sm"
        style={{ height: "300px" }} // Giảm chiều cao bảng vẽ
      >
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 h-full w-full ${
            !isEraser ? "cursor-crosshair" : "cursor-none"
          }`}
          onMouseDown={startDrawing}
          onMouseMove={(e) => {
            draw(e);
            if (isEraser) {
              setCursorPos({
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
              });
            }
          }}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        {isEraser && cursorPos && (
          <div
            className="pointer-events-none absolute rounded-full border border-red-500 bg-transparent"
            style={{
              width: eraserSize,
              height: eraserSize,
              top: cursorPos.y - eraserSize / 2,
              left: cursorPos.x - eraserSize / 2,
            }}
          />
        )}

        {/* Nút công cụ */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              setIsEraser(false);
              context.strokeStyle = "#000000";
              context.lineWidth = 4;
            }}
            className={`rounded p-1 shadow-sm ${
              !isEraser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            } transition hover:bg-blue-600`}
            title="Bút vẽ"
          >
            <FaBrush />
          </button>
          <button
            type="button"
            onClick={() => setIsEraser(true)}
            className={`rounded p-1 shadow-sm ${
              isEraser ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
            } transition hover:bg-red-600`}
            title="Tẩy"
          >
            <FaEraser />
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="rounded bg-gray-500 p-1 text-white shadow-sm transition hover:bg-gray-600"
            title="Xóa bảng vẽ"
          >
            <FaTrash />
          </button>
          <button
            type="button"
            onClick={saveAsImage}
            className="rounded bg-green-500 p-1 text-white shadow-sm transition hover:bg-green-600"
            title="Lưu hình ảnh"
          >
            <FaCloudUploadAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingBoard;
