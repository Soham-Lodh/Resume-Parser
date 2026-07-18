"use client"

import { useEffect } from "react"
import { AlertCircle, CheckCircle, AlertTriangle, X } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "warning"
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  }

  const colors = {
    success: "bg-[#606c38] text-[#fefae0]",
    error: "bg-[#bc6c25] text-[#fefae0]",
    warning: "bg-[#dda15e] text-[#283618]",
  }

  return (
    <div
      className={`${colors[type]} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-4 fade-in`}
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
