import { toTitleCase } from "@/others/function"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

const DropdownField = (props) => {
    const objConvert = () => {
        return props.list.map(e => {
            const [value = null, label = null] = Object.values(e) || []
            return { value, label }
        })
    }
    return (
        <div className="w-full relative" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <select className="text-[0.8em] w-full" name={props.name} onChange={props.onChange} value={props.val} required={props.req} style={{
                maxWidth: '100%',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
            }}>
                {props.default && <option value={props.default.val}>{props.default.label}</option>}
                {objConvert().map((e, i) => 
                    <option key={i} value={e.value}>{props.titleCase ? toTitleCase(e.label) : e.label.toUpperCase()}</option>
                )}
            </select>
            <div className="text-[#d12323] text-[12px] flex items-center gap-2">
                <div className="transition-[0.2s] font-[1000]">
                    {props.error}
                </div>
            </div>
        </div>
    )
}

const Search = ({ list, name, val, onChange, req, error, default: def }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const rafId = useRef(null);

  const objConvert = () =>
    list.map((e) => {
      const values = Object.values(e || {});
      return { value: values[0] ?? null, label: values[1] ?? null };
    });

  const filtered = objConvert().filter((o) =>
    (o.label ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value) => {
    onChange({ target: { name, value } });
    setOpen(false);
    setSearch("");
  };

  const selectedLabel =
    objConvert().find((o) => o.value === val)?.label ||
    def?.label ||
    "Select...";

  /** 🧭 Position tracking using visualViewport to fix keyboard issues */
  const updatePosition = () => {
    if (!open || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportOffset = window.visualViewport
      ? window.visualViewport.offsetTop
      : 0;

    setPos({
      top: rect.bottom + viewportOffset + 4,
      left: rect.left,
      width: rect.width,
    });

    rafId.current = requestAnimationFrame(updatePosition);
  };

  useEffect(() => {
    if (open) {
      updatePosition();
    } else {
      cancelAnimationFrame(rafId.current);
    }
    return () => cancelAnimationFrame(rafId.current);
  }, [open]);

  /** 🔒 Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`border rounded-md w-full px-3 py-2 text-[0.85em] flex items-center justify-between gap-2 transition-colors duration-200 ${
          req && !val
            ? "border-red-500"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span className="flex-1 break-words whitespace-normal text-left block">
  {selectedLabel}
</span>

        <i
          className={`fa-solid fa-chevron-down text-gray-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu in portal */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 9999,
            }}
            className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto text-[0.85em]"
          >
            {/* Search Bar */}
            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-1.5 border border-gray-300 rounded-md text-[0.8em] focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Default Option */}
            {def && (
              <div
                className="p-2 cursor-pointer hover:bg-gray-100 truncate"
                onClick={() => handleSelect(def.value)}
              >
                {def.label}
              </div>
            )}

            {/* Items */}
            {filtered.length > 0 ? (
              filtered.map((o, i) => (
                <div
                  key={i}
                  className="p-2 cursor-pointer hover:bg-blue-50 truncate"
                  onClick={() => handleSelect(o.value)}
                >
                  {o.label}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-400 text-center text-[0.8em]">
                No results found
              </div>
            )}
          </div>,
          document.body
        )}

      {error && (
        <p className="text-red-600 text-[12px] mt-1 font-semibold">{error}</p>
      )}
    </div>
  );
};





DropdownField.Search = Search
export default DropdownField