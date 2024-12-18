import React from "react";
import { BlockMath } from "react-katex";

const LatexPreview = ({ latexString }) => {
  return (
    // <div>
    //   <Latex>{latexString}</Latex>
    // </div>
    <div className="500 flex flex-col items-center overflow-auto bg-gray-100 p-2">
      {/* Hiển thị LaTeX */}
      <div className="flex w-full max-w-4xl flex-col">
        <h1 className="mb-2 text-center text-lg font-bold text-gray-700">
          Latex Preview
        </h1>
        <div className="mb-2 w-full rounded-lg border border-gray-300 bg-white p-2 shadow-sm">
          {latexString ? (
            <BlockMath>{latexString}</BlockMath>
          ) : (
            <p className="text-sm text-gray-500">
              Chưa có dữ liệu LaTeX để hiển thị.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatexPreview;
