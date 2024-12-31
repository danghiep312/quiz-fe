import React from "react";
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const MathContent = ({ content }) => {
  const renderContent = (text) => {
    const parts = text.split(/(\$.*?\$)/); // Tách các phần công thức (được bao bởi $...$)
    return parts.map((part, index) =>
      part.startsWith("$") && part.endsWith("$") ? (
        <InlineMath key={index} math={part.slice(1, -1)} />
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return <div>{renderContent(content)}</div>;
};

export default MathContent;
