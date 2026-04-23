"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { createPortal } from "react-dom";

interface WeekPickerProps {
  value: string; // Định dạng YYYY-MM-DD (luôn là Thứ 2)
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  minDate?: string;
}

// ── Các hàm tiện ích xử lý ngày tháng ──
const formatYYYYMMDD = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDDMMYYYY = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

// Tính ngày kết thúc tuần (Thêm 6 ngày vào Thứ 2)
const getWeekEndDate = (mondayStr: string) => {
  if (!mondayStr) return "";
  const d = new Date(mondayStr);
  d.setDate(d.getDate() + 6);
  return formatDDMMYYYY(d);
};

export function WeekPicker({
  value,
  onChange,
  disabled,
  placeholder = "Chọn tuần",
  className = "",
  minDate,
}: WeekPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Lưu tháng/năm đang hiển thị trên lịch (mặc định lấy theo value hoặc tháng hiện tại)
  const initialDate = value ? new Date(value) : new Date();
  const [currentView, setCurrentView] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !dropdownRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tính toán vị trí hiển thị (giống component Select)
  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      if (!triggerRect) return;
      setMenuStyle({
        top: triggerRect.bottom + 6,
        left: triggerRect.left,
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  // Sinh mảng ngày hiển thị trên lịch (bắt đầu từ Thứ 2)
  const weeks = useMemo(() => {
    const year = currentView.getFullYear();
    const month = currentView.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Date[] = [];
    // Đệm các ngày của tháng trước (Thứ 2 là 1, CN là 0 -> chuyển thành 7)
    let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = startOffset; i > 0; i--) {
      days.push(new Date(year, month, 1 - i));
    }
    // Các ngày trong tháng hiện tại
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    // Đệm các ngày của tháng sau cho đủ hàng
    let endOffset = days.length % 7 === 0 ? 0 : 7 - (days.length % 7);
    for (let i = 1; i <= endOffset; i++) {
      days.push(new Date(year, month + 1, i));
    }

    // Chia thành các tuần (mỗi mảng con 7 ngày)
    const weeksArr: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksArr.push(days.slice(i, i + 7));
    }
    return weeksArr;
  }, [currentView]);

  const handlePrevMonth = () =>
    setCurrentView(
      new Date(currentView.getFullYear(), currentView.getMonth() - 1, 1),
    );
  const handleNextMonth = () =>
    setCurrentView(
      new Date(currentView.getFullYear(), currentView.getMonth() + 1, 1),
    );

  const handleSelectWeek = (monday: Date) => {
    onChange(formatYYYYMMDD(monday));
    setIsOpen(false);
  };

  // Text hiển thị trên nút bấm
  const displayValue = value
    ? `${formatDDMMYYYY(new Date(value))} - ${getWeekEndDate(value)}`
    : "";

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block w-full text-left ${className}`}
    >
      {/* ── NÚT TRIGGER ── */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex w-full items-center justify-between rounded-xl border bg-card px-3.5 py-2.5 text-sm transition-all duration-200
          ${disabled ? "cursor-not-allowed border-border bg-gray-50 text-foreground/70" : "cursor-pointer border-border text-foreground shadow-sm hover:border-primary-400"}
          ${isOpen ? "ring-[3px] ring-primary-100" : ""}
        `}
      >
        <span className={displayValue ? "font-medium" : "text-foreground"}>
          {displayValue || placeholder}
        </span>
        <CalendarIcon size={16} className="text-gray-400 ml-2 shrink-0" />
      </button>

      {/* ── POPUP LỊCH (PORTAL) ── */}
      {isOpen &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[99999] w-[280px] rounded-xl bg-card p-3 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: menuStyle.top, left: menuStyle.left }}
          >
            {/* Header đổi tháng */}
            <div className="flex items-center justify-between mb-3 px-1">
              <button
                onClick={handlePrevMonth}
                className="rounded p-1 hover:bg-gray-100 text-foreground/70 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-bold text-primary-heading">
                Tháng {currentView.getMonth() + 1}, {currentView.getFullYear()}
              </div>
              <button
                onClick={handleNextMonth}
                className="rounded p-1 hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Khung ngày tháng */}
            <div className="w-full text-sm">
              <div className="grid grid-cols-7 mb-1 text-center text-xs font-semibold text-foreground/70">
                <div>T2</div>
                <div>T3</div>
                <div>T4</div>
                <div>T5</div>
                <div>T6</div>
                <div>T7</div>
                <div>CN</div>
              </div>

              <div className="flex flex-col gap-1">
                {weeks.map((week, idx) => {
                  const monday = week[0];
                  const mondayStr = formatYYYYMMDD(monday);
                  const isSelectedWeek = value === formatYYYYMMDD(monday);
                  const isCurrentMonthWeek = week.some(
                    (d) => d.getMonth() === currentView.getMonth(),
                  );
                  const isPastWeek = minDate ? mondayStr < minDate : false;
                  // Ẩn bớt tuần nếu nó rơi hoàn toàn vào tháng khác
                  if (!isCurrentMonthWeek) return null;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (!isPastWeek) handleSelectWeek(monday); // Chỉ cho click nếu không past
                      }}
                      className={`
                        grid grid-cols-7 rounded-lg cursor-pointer transition-colors relative group
                        ${isSelectedWeek ? "!bg-primary-100 !text-primary-700 font-bold" : "hover:bg-primary-hover/50 text-foreground"}
                      `}
                    >
                      {/* Dải highlight background nối liền cho đẹp giống Antd */}
                      {isSelectedWeek && (
                        <div className="absolute inset-0 border border-primary-300 rounded-lg pointer-events-none" />
                      )}

                      {week.map((day, dIdx) => {
                        const isCurrentMonth =
                          day.getMonth() === currentView.getMonth();
                        return (
                          <div
                            key={dIdx}
                            className={`py-1.5 text-center ${isCurrentMonth ? "" : "font-light"} `}
                          >
                            {day.getDate()}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
