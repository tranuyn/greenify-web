import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface CustomSelectProps<T extends string = string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

export function Select<T extends string = string>({
  options,
  value,
  onChange,
  disabled,
  isLoading,
  className = "",
  placeholder = "",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Tìm label của item đang được chọn để hiển thị
  const selectedOption = options.find((opt) => opt.value === value);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      if (!triggerRect) return;

      setMenuStyle({
        top: triggerRect.bottom + 6,
        left: triggerRect.left,
        width: triggerRect.width,
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

  const handleSelect = (val: T, isDisabled?: boolean) => {
    if (isDisabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block w-full min-w-[80px] text-left ${className}`}>
      {/* ── NÚT BẤM (Trông giống thẻ select) ── */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex w-full items-center justify-between rounded-lg border bg-white py-2 pl-3 pr-3 text-sm font-medium transition-all duration-200
          ${disabled || isLoading 
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400" 
            : "cursor-pointer border-gray-300 text-gray-700 shadow-sm hover:border-primary-400"
          }
          ${isOpen ? "border-primary-500 ring-[3px] ring-primary-100" : ""}
        `}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <div className="ml-2 flex shrink-0 items-center text-gray-400">
          {isLoading ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          ) : (
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-primary-500" : ""}`}
            />
          )}
        </div>
      </button>

      {/* ── DANH SÁCH DROPDOWN (Tự code bằng ul/li) ── */}
      {isOpen &&
        menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed z-[220] origin-top rounded-lg bg-white shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100"
            style={{
              top: menuStyle.top,
              left: menuStyle.left,
              width: menuStyle.width,
            }}
          >
            <ul className="max-h-60 overflow-auto rounded-lg py-1 text-sm focus:outline-none scrollbar-thin scrollbar-thumb-gray-200">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={opt.value}
                    onClick={() => handleSelect(opt.value, opt.disabled)}
                    className={`
                      relative flex cursor-pointer select-none items-center py-2 pl-3 pr-9 transition-colors
                      ${opt.disabled ? "cursor-not-allowed text-gray-400" : "text-gray-700 hover:bg-gray-100"}
                      ${isSelected ? "bg-primary-50 font-bold text-primary-700 hover:bg-primary-100" : ""}
                    `}
                  >
                    <span className="block truncate">{opt.label}</span>

                    {/* Icon Checkmark cho item đang chọn giống Antd */}
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600">
                        <Check size={16} strokeWidth={3} />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  );
}