import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 600);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-green-50",
      border: "bg-green-500",
      text: "text-green-800",
      icon: <FaCheckCircle className="text-green-500" />,
    },
    error: {
      bg: "bg-red-50",
      border: "bg-red-500",
      text: "text-red-800",
      icon: <FaExclamationCircle className="text-red-500" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "bg-yellow-500",
      text: "text-yellow-800",
      icon: <FaExclamationTriangle className="text-yellow-500" />,
    },
    info: {
      bg: "bg-blue-50",
      border: "bg-blue-500",
      text: "text-blue-800",
      icon: <FaInfoCircle className="text-blue-500" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        fixed right-5 top-24 z-[9999]
        flex min-w-[320px] max-w-[420px] items-center gap-4
        rounded-xl border border-white/50
        p-4 shadow-lg
        transition-all duration-500
        ${style.bg}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}
      `}
    >
      <div
        className={`absolute bottom-4 left-0 top-4 w-1 rounded-r-full ${style.border}`}
      />

      <div className="ml-2 shrink-0 text-xl">{style.icon}</div>

      <div className={`flex-1 text-sm font-medium ${style.text}`}>
        {message}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-black/5 hover:text-gray-600"
      >
        <FaTimes size={13} />
      </button>
    </div>
  );
};

export default Toast;
