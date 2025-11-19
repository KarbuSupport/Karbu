"use client"

import { useAuth } from "@/src/shared/context/AuthContext"
import { can } from "@/src/shared/functions/permissions"
import { motion, AnimatePresence } from "framer-motion"

interface ModalOpcionesContratoProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (option: "ver" | "editar" | "cerrar") => void
}

export default function ModalOpcionesContrato({
  isOpen,
  onClose,
  onSelect,
}: ModalOpcionesContratoProps) {
  const systemPermissions = useAuth().permissions;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-[90%] max-w-sm text-center shadow-lg"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h2 className="text-lg font-semibold mb-4">
              ¿Qué deseas hacer con el contrato?
            </h2>

            <div className="flex flex-col gap-2">
              {can(systemPermissions, "View_Contracts") && (<button
                onClick={() => onSelect("ver")}
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Ver
              </button>)}
              {can(systemPermissions, "Edit_Contracts") && (
                <button
                  onClick={() => onSelect("editar")}
                  className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Editar
                </button>)
              }
              <button
                onClick={() => {
                  onSelect("cerrar")
                  onClose()
                }}
                className="bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
