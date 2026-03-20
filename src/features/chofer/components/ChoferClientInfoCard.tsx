"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Calendar as CalendarIcon, FileText } from "lucide-react";
import { InvoiceDetail } from "../models";
import { OverallBadge } from "@/features/logistics/components/OverallBadge";

interface ChoferClientInfoCardProps {
  invoice: InvoiceDetail;
}

export const ChoferClientInfoCard = ({ invoice }: ChoferClientInfoCardProps) => {
  const { client, invoiceNumber, overallState } = invoice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border p-5 md:p-6 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#155DFC]/40 to-transparent" />

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5 md:mb-6">
        <div className="flex items-start gap-4 w-full md:w-auto">
          {/* Avatar */}
          <div
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl text-white flex items-center justify-center shrink-0 font-bold text-lg md:text-xl border border-blue-400/20"
            style={{ background: "linear-gradient(135deg, #155DFC, #2563EB)", boxShadow: "0 4px 20px rgba(21,93,252,0.25)" }}
          >
            {client.initials}
          </div>
          <div>
            <h2
              className="text-xl md:text-2xl font-extrabold leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {client.name}
            </h2>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                style={{
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-input)",
                  borderColor: "var(--border-color)",
                }}
              >
                <FileText className="w-3.5 h-3.5" style={{ color: "var(--text-secondary)" }} />
                {invoiceNumber}
              </span>
              <OverallBadge state={overallState} />
            </div>
          </div>
        </div>

        {/* Contact + Date — side by side */}
        <div
          className="flex items-center gap-4 px-4 py-3 rounded-xl border w-full md:w-auto mt-1 md:mt-0 shrink-0"
          style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#16A34A" }}>
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {client.phone}
            </span>
          </div>
          <div className="w-px h-4 shrink-0" style={{ backgroundColor: "var(--border-color)" }} />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#D97706" }}>
              <CalendarIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {client.deliveryDate}
            </span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div
        className="flex items-start gap-4 p-4 md:p-5 rounded-xl border"
        style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-color)" }}
      >
        <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#155DFC" }}>
          <MapPin className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-widest block mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Dirección de Entrega
          </span>
          <span
            className="text-sm md:text-base font-medium leading-relaxed"
            style={{ color: "var(--text-primary)" }}
          >
            {client.address}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
