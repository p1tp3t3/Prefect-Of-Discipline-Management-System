import { useState } from "react";

const ViewToggleBtn = ({ defaultView = "g", onChange }) => {
  const [view, setView] = useState(defaultView);

  const handleChange = (newView) => {
    setView(newView);
    if (onChange) onChange(newView); // callback for parent
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-full overflow-hidden">
      {/* Grid button */}
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition ${
          view === "g"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => handleChange("g")}
      >
        <i className="fa-solid fa-border-all"></i>
        Grid
      </button>

      {/* List button */}
      <button
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition ${
          view === "l"
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-gray-300"
        }`}
        onClick={() => handleChange("l")}
      >
        <i className="fa-solid fa-list"></i>
        List
      </button>
    </div>
  );
};

export default ViewToggleBtn;
