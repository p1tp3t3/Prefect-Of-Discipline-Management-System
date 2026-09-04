import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './style.css';
import CircleReload from "../reload/circle-reload";
import { Calendar as CalendarIcon, Eye } from "lucide-react";

const AnchorModal = ({ open, anchorRef, containerRef, onClose, items }) => {
  const [pos, setPos] = useState(null);
  const modalRef = useRef(null);

  const updatePosition = () => {
    if (!anchorRef || !anchorRef.current || !containerRef?.current) {
      setPos(null);
      return;
    }

    const anchorEl = anchorRef.current;
    const containerEl = containerRef.current;

    const anchorRect = anchorEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const menuWidth = 240;
    const menuHeight = items.length * 44 + 16;

    let top = anchorRect.bottom - containerRect.top + containerEl.scrollTop;
    let left = anchorRect.left - containerRect.left + containerEl.scrollLeft + anchorRect.width + 6;

    if (left + menuWidth > containerRect.width + containerEl.scrollLeft) {
      left = anchorRect.left - containerRect.left + containerEl.scrollLeft - menuWidth - 6;
    }
    if (left < containerEl.scrollLeft) left = containerEl.scrollLeft + 6;

    if (top + menuHeight > containerRect.height + containerEl.scrollTop) {
      top = anchorRect.top - containerRect.top + containerEl.scrollTop - menuHeight;
    }
    if (top < containerEl.scrollTop) top = containerEl.scrollTop + 6;

    setPos({ top, left });
  };

  // Close on click outside
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(containerRef.current);

    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, anchorRef, containerRef, items]);

  return (
    <AnimatePresence>
      {open && pos && (
        <motion.div
          ref={modalRef}
          className="absolute z-50"
          style={{ top: pos.top, left: pos.left, width: 240 }}
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="rounded-md shadow-2xl border border-neutral-300 bg-gray-100 py-2">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-blue-700 hover:text-white transition-colors"
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


const parseCalendarDate = (raw) => {
if (!raw) return null;
const match = raw.match(/[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4}/);
const clean = match ? match[0] : raw;
const dateObj = new Date(clean);
if (isNaN(dateObj)) return null;
const y = dateObj.getFullYear();
const m = String(dateObj.getMonth() + 1).padStart(2, "0");
const d = String(dateObj.getDate()).padStart(2, "0");
return { dateObj, readable: dateObj.toDateString(), ymd: `${y}-${m}-${d}` };
};

const Calendar = ({ list = [], events = [] }) => {
const [selectedYMD, setSelectedYMD] = useState(null);
const [modalOpen, setModalOpen] = useState(false);
const [modalAnchor, setModalAnchor] = useState(null);
const calendarRef = useRef(null);

if (!list || list.length === 0) 
return <div className="h-full grid place-items-center">
    <CircleReload size={3} />
</div>;

const parsed = parseCalendarDate(list[0].date);
if (!parsed) return <div className="p-4 text-red-600">Invalid date format</div>;

const baseDate = parsed.dateObj;
const year = baseDate.getFullYear();
const month = baseDate.getMonth();

const firstDay = new Date(year, month, 1).getDay();
const lastDate = new Date(year, month + 1, 0).getDate();

const calendar = [];
let count = 1;
for (let r = 0; r < 6; r++) {
const week = [];
for (let c = 0; c < 7; c++) {
if (r === 0 && c < firstDay) week.push(null);
else if (count > lastDate) week.push(null);
else {
const d = String(count).padStart(2, "0");
const m = String(month + 1).padStart(2, "0");
week.push({ day: count, ymd: `${year}-${m}-${d}` });
count++;
}
}
calendar.push(week);
}

const countMap = {};
for (const item of list) {
const parsed = parseCalendarDate(item.date);
if (parsed) countMap[parsed.ymd] = item.count ?? 0;
}

return (
  <div className="p-4 select-none relative w-full" ref={calendarRef}>
    <h2 className="text-lg font-bold mb-3 text-center sm:text-left">
      {baseDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
    </h2>

    {/* Weekday header */}
    <div className="grid grid-cols-7 text-center font-semibold mb-2 text-xs sm:text-sm">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
        <div key={d} className="truncate">{d}</div>
      ))}
    </div>

    {/* Calendar grid */}
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {calendar.map((week, i) =>
        week.map((day, j) =>
          day ? (
            <CalendarCell
              key={`${i}-${j}`}
              day={day.day}
              ymd={day.ymd}
              count={countMap[day.ymd] ?? 0}
              selectedYMD={selectedYMD}
              setSelectedYMD={setSelectedYMD}
              setModalOpen={setModalOpen}
              setModalAnchor={setModalAnchor}
            />
          ) : (
            <div key={`${i}-${j}`} className="h-16 sm:h-20"></div>
          )
        )
      )}
    </div>

    <AnchorModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      anchorRef={modalAnchor}
      containerRef={calendarRef}
      items={[
        {
          label: "Schedule an Appointment",
          icon: CalendarIcon,
          onClick: () => { events[1]?.(selectedYMD); setModalOpen(false); }
        },
        {
          label: "View Scheduled Users",
          icon: Eye,
          onClick: () => { events[0]?.(selectedYMD); setModalOpen(false); }
        }
      ]}
    />
  </div>
);
}

const CalendarCell = ({
  day,
  ymd,
  count,
  selectedYMD,
  setSelectedYMD,
  setModalOpen,
  setModalAnchor
}) => {
  const ref = useRef(null);
  const today = new Date(); 
  today.setHours(0, 0, 0, 0);
  const dateObj = new Date(ymd);
  const isPast = dateObj < today;

  const openPopover = () => {
    if (isPast) return;
    setSelectedYMD(ymd);
    setModalAnchor(ref);
    setModalOpen(true);
  };

  return (
    <div
      ref={ref}
      onClick={openPopover}
      className={`
        h-16 sm:h-20 p-1 sm:p-2 rounded-md border flex flex-col justify-between cursor-pointer transition
        ${isPast ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-blue-50"}
        ${selectedYMD === ymd ? "border-blue-600 bg-blue-100" : "border-gray-300"}
      `}
    >
      <div className="text-xs sm:text-sm font-semibold">{day}</div>

      {count > 0 && (
        <div className="text-[10px] sm:text-xs bg-red-600 text-white rounded-full px-1 sm:px-2 py-0.5 sm:py-1 self-end">
          {count}
        </div>
      )}
    </div>
  );
};

export default Calendar;