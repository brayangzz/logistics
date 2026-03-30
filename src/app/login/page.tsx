"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Eye, EyeOff, ArrowRight, Loader2,
  CheckCircle2, Truck, LayoutDashboard, Package, XCircle,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";

/* ──────────────────────────────────────────
   Floating label input
────────────────────────────────────────── */
const FloatingInput = ({
  label, type, value, onChange, autoComplete, suffix, autoFocus, hasError,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; autoComplete?: string;
  suffix?: React.ReactNode; autoFocus?: boolean; hasError?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.div
        animate={{
          borderColor: hasError
            ? "rgba(239,68,68,0.65)"
            : focused
            ? "rgba(59,130,246,0.85)"
            : "var(--border-color)",
          boxShadow: hasError
            ? "0 0 0 3px rgba(239,68,68,0.09)"
            : focused
            ? "0 0 0 3px rgba(59,130,246,0.1)"
            : "none",
          backgroundColor: focused ? "rgba(59,130,246,0.045)" : "var(--bg-input)",
        }}
        transition={{ duration: 0.18 }}
        className="relative rounded-xl"
        style={{ border: "1px solid transparent" }}
      >
        <motion.label
          animate={{
            y: lifted ? -11 : 0,
            scale: lifted ? 0.68 : 1,
            color: hasError
              ? "#FCA5A5"
              : focused
              ? "#93C5FD"
              : lifted
              ? "var(--text-secondary)"
              : "var(--text-muted)",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
          className="absolute left-4 top-[20px] origin-left font-medium pointer-events-none select-none"
          style={{ fontSize: "16px" }}
        >
          {label}
        </motion.label>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent outline-none pt-[32px] pb-[12px] px-4 pr-12"
          style={{ color: "var(--text-primary)", caretColor: "#60A5FA", fontSize: "16px" }}
        />

        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-[8%] right-[8%] h-px pointer-events-none"
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: "linear-gradient(90deg, transparent, #3B82F6 30%, #93C5FD 70%, transparent)",
          transformOrigin: "center",
        }}
      />
    </div>
  );
};

/* ──────────────────────────────────────────
   Error overlay
────────────────────────────────────────── */
const ErrorOverlay = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 1700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center z-20 rounded-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      style={{ backgroundColor: "rgba(7,11,20,0.93)", backdropFilter: "blur(6px)" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{ scale: 0.4, opacity: 0.55 }}
          animate={{ scale: 2.2 + i * 0.55, opacity: 0 }}
          transition={{ duration: 1, delay: i * 0.14, ease: "easeOut" }}
          style={{ width: 68, height: 68, border: "1px solid rgba(239,68,68,0.5)" }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, rotate: 40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.08 }}
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{
          background: "radial-gradient(circle, rgba(239,68,68,0.22), rgba(239,68,68,0.04))",
          border: "1px solid rgba(239,68,68,0.35)",
          boxShadow: "0 0 28px rgba(239,68,68,0.18)",
        }}
      >
        <XCircle className="w-7 h-7 text-red-400" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="text-sm font-bold text-white"
      >
        Acceso denegado
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
        className="text-xs mt-1"
        style={{ color: "rgba(252,165,165,0.75)" }}
      >
        Usuario o contraseña incorrectos
      </motion.p>
    </motion.div>
  );
};

/* ──────────────────────────────────────────
   Success overlay
────────────────────────────────────────── */
const SuccessOverlay = ({ userName }: { userName: string }) => (
  <motion.div
    className="absolute inset-0 flex flex-col items-center justify-center z-20 rounded-2xl"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={{ backgroundColor: "rgba(7,11,20,0.95)", backdropFilter: "blur(8px)" }}
  >
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        initial={{ scale: 0.5, opacity: 0.65 }}
        animate={{ scale: 2.5 + i * 0.55, opacity: 0 }}
        transition={{ duration: 1.3, delay: i * 0.2, ease: "easeOut" }}
        style={{ width: 76, height: 76, border: "1px solid rgba(21,93,252,0.4)" }}
      />
    ))}
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 230, damping: 17, delay: 0.1 }}
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{
        background: "linear-gradient(135deg, #1A65FF, #2563EB)",
        boxShadow: "0 0 50px rgba(21,93,252,0.55), 0 0 90px rgba(21,93,252,0.2)",
      }}
    >
      <CheckCircle2 className="w-9 h-9 text-white" />
    </motion.div>
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="text-base font-bold text-white"
    >
      Acceso concedido
    </motion.p>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.52 }}
      className="text-sm mt-1"
      style={{ color: "rgba(148,163,184,0.7)" }}
    >
      Bienvenido, {userName}
    </motion.p>
    <motion.div
      className="mt-6 h-0.5 rounded-full overflow-hidden"
      style={{ width: 100, backgroundColor: "rgba(255,255,255,0.07)" }}
    >
      <motion.div
        className="h-full"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.1, delay: 0.62, ease: "easeInOut" }}
        style={{ background: "linear-gradient(90deg, #1A65FF, #93C5FD)" }}
      />
    </motion.div>
  </motion.div>
);

/* ──────────────────────────────────────────
   Left panel stat card
────────────────────────────────────────── */
const FloatingCard = ({
  icon: Icon, label, value, delay, style, isDark,
}: {
  icon: React.ElementType; label: string; value: string;
  delay: number; style: React.CSSProperties; isDark: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl select-none"
    style={{
      background: isDark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.75)",
      border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(21,93,252,0.15)",
      backdropFilter: "blur(14px)",
      boxShadow: isDark ? "0 8px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 8px 28px rgba(21,93,252,0.1)",
      ...style,
    }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: "rgba(21,93,252,0.15)", border: "1px solid rgba(21,93,252,0.18)" }}
    >
      <Icon className="w-4 h-4 text-[#155DFC]" />
    </div>
    <div>
      <p className="text-[11px] font-medium leading-tight" style={{ color: isDark ? "rgba(148,163,184,0.6)" : "#64748B" }}>{label}</p>
      <p className="text-sm font-bold leading-tight mt-0.5" style={{ color: isDark ? "#fff" : "#0F172A" }}>{value}</p>
    </div>
  </motion.div>
);

/* ──────────────────────────────────────────
   Page
────────────────────────────────────────── */
export default function LoginPage() {
  const { user, login } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const logoFilter = isDark
    ? "brightness(0) invert(1)"
    : "brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(1700%) hue-rotate(210deg) brightness(95%)";
  const redirected = useRef(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState("");

  const shakeControls = useAnimation();

  // If already logged in, redirect once
  useEffect(() => {
    if (user && !redirected.current) {
      redirected.current = true;
      router.replace(
        user.role === "chofer"  ? "/chofer"
        : user.role === "guardia" ? "/autorizar"
        : user.role === "admin"   ? "/supervision"
        : user.role === "caja"    ? "/caja"
        : "/logistics"
      );
    }
  }, [user, router]);

  const triggerShake = async () => {
    await shakeControls.start({
      x: [0, -9, 9, -7, 7, -4, 4, -1, 1, 0],
      transition: { duration: 0.5 },
    });
    shakeControls.set({ x: 0 });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!username || !password || submitting || showError || showSuccess) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const ok = await login(username, password);

    if (ok) {
      setSuccessUser(
        username === "chofer"  ? "Carlos Ramírez"
        : username === "guardia" ? "Guardia Control"
        : username === "admin"   ? "Admin General"
        : username === "caja"    ? "Caja Admin"
        : "Logística Admin"
      );
      setShowSuccess(true);
      setTimeout(() => {
        router.push(
          username === "chofer"  ? "/chofer"
          : username === "guardia" ? "/autorizar"
          : username === "admin"   ? "/supervision"
          : username === "caja"    ? "/caja"
          : "/logistics"
        );
      }, 2000);
    } else {
      setSubmitting(false);
      triggerShake();
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ backgroundColor: isDark ? "#07111C" : "var(--bg-primary)" }}>

      {/* ═══════════════ LEFT PANEL ═══════════════ */}
      <div className="hidden lg:flex relative flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: isDark
            ? "linear-gradient(150deg, #07111C 0%, #0B1A30 50%, #081422 100%)"
            : "linear-gradient(150deg, #EFF6FF 0%, #DBEAFE 50%, #EFF6FF 100%)",
        }} />

        {/* Glow orb */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 560, height: 560,
            left: "50%", top: "50%",
            translateX: "-50%", translateY: "-50%",
            background: "radial-gradient(circle, rgba(21,93,252,0.09) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(148,163,184,0.09) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(21,93,252,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

        {/* Divider */}
        <div className="absolute right-0 top-0 bottom-0 w-px" style={{
          background: isDark
            ? "linear-gradient(to bottom, transparent 8%, rgba(59,130,246,0.25) 30%, rgba(59,130,246,0.18) 70%, transparent 92%)"
            : "linear-gradient(to bottom, transparent 8%, rgba(21,93,252,0.2) 30%, rgba(21,93,252,0.15) 70%, transparent 92%)",
        }} />

        {/* Stat cards */}
        <FloatingCard icon={Package}         label="Órdenes hoy"      value="142 activas" delay={0.9}  style={{ top: "21%",    left: "7%"  }} isDark={isDark} />
        <FloatingCard icon={Truck}           label="Choferes en ruta"  value="18 / 24"     delay={1.1}  style={{ bottom: "27%", right: "6%" }} isDark={isDark} />
        <FloatingCard icon={LayoutDashboard} label="Cobertura"         value="96.4%"       delay={1.3}  style={{ bottom: "14%", left: "9%"  }} isDark={isDark} />

        {/* Brand */}
        <motion.div
          className="relative flex flex-col items-center z-10"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          >
            <img
              src="/logo3.png"
              alt="Compers"
              style={{ width: 260, filter: isDark ? "brightness(0) invert(1)" : logoFilter }}
            />
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, scaleX: 0 }, visible: { opacity: 1, scaleX: 1 } }}
            className="mt-5 h-px w-40"
            style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)" }}
          />

          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="mt-3 tracking-[0.3em] uppercase font-semibold"
            style={{ fontSize: "clamp(10px, 0.9vw, 12px)", color: isDark ? "rgba(148,163,184,0.45)" : "rgba(21,93,252,0.5)" }}
          >
            Sistema de Logística
          </motion.p>
        </motion.div>
      </div>

      {/* ═══════════════ RIGHT PANEL ═══════════════ */}
      <div
        className="relative flex flex-1 flex-col items-center justify-start lg:justify-center overflow-y-auto py-10 lg:py-0"
        style={{ background: isDark ? "linear-gradient(160deg, #0C1828 0%, #08121E 50%, #060D18 100%)" : "var(--bg-primary)" }}
      >
        {/* Glows */}
        {isDark && <>
          <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{
            background: "radial-gradient(circle at top right, rgba(59,130,246,0.07), transparent 55%)",
          }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none" style={{
            background: "radial-gradient(circle at bottom left, rgba(21,93,252,0.05), transparent 60%)",
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }} />
        </>}

        {/* Mobile logo */}
        <motion.div
          className="lg:hidden flex items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <img
            src="/logo3.png"
            alt="Compers"
            style={{ height: 30, filter: logoFilter }}
          />
        </motion.div>

        {/* Form card — entrance wrapper */}
        <motion.div
          className="relative w-full px-4 sm:px-8"
          style={{ maxWidth: "520px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
        {/* Shake wrapper */}
        <motion.div animate={shakeControls}>
          {/* Glow halo */}
          <div className="absolute -inset-4 rounded-[32px] pointer-events-none" style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(21,93,252,0.08), transparent 70%)",
            filter: "blur(16px)",
          }} />

          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "24px",
              background: isDark
                ? "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)"
                : "var(--bg-secondary)",
              border: isDark ? "1px solid rgba(255,255,255,0.09)" : "1px solid var(--border-color)",
              boxShadow: isDark
                ? "0 40px 100px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08) inset"
                : "0 8px 40px rgba(0,0,0,0.08)",
            }}
          >
            {/* Top shimmer line */}
            <div style={{
              height: "2px",
              background: isDark
                ? "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.0) 10%, rgba(59,130,246,0.7) 35%, rgba(147,197,253,0.6) 65%, rgba(59,130,246,0.0) 90%, transparent 100%)"
                : "linear-gradient(90deg, transparent 0%, rgba(21,93,252,0.0) 10%, rgba(21,93,252,0.5) 35%, rgba(59,130,246,0.4) 65%, rgba(21,93,252,0.0) 90%, transparent 100%)",
            }} />

            {/* Subtle inner highlight top-left */}
            <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none" style={{
              background: "radial-gradient(circle at top left, rgba(255,255,255,0.04), transparent 60%)",
            }} />

            {/* Overlays */}
            <AnimatePresence>
              {showError && <ErrorOverlay onDone={() => setShowError(false)} />}
            </AnimatePresence>
            <AnimatePresence>
              {showSuccess && <SuccessOverlay userName={successUser} />}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="px-6 pt-8 pb-7 sm:px-11 sm:pt-11 sm:pb-9">

              {/* Header */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <motion.p
                  className="flex items-center gap-2.5 font-bold uppercase mb-4"
                  style={{ fontSize: "12px", letterSpacing: "0.24em", color: "#60A5FA" }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 }}
                >
                  <span style={{ display: "inline-block", width: "20px", height: "1px", background: "#60A5FA", opacity: 0.7 }} />
                  Iniciar sesión
                </motion.p>

                <h1 className="font-extrabold leading-[1.1] text-3xl sm:text-4xl" style={{ color: "var(--text-primary)" }}>
                  Bienvenido<br />
                  <span style={{ color: "var(--text-primary)" }}>de vuelta</span>
                </h1>

                <p className="mt-3" style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Ingresa tus credenciales para continuar
                </p>
              </motion.div>

              {/* Fields */}
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46 }}
              >
                <FloatingInput
                  label="Usuario"
                  type="text"
                  value={username}
                  onChange={(v) => { setUsername(v); }}
                  autoComplete="username"
                  hasError={showError}
                />
                <FloatingInput
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(v) => { setPassword(v); }}
                  autoComplete="current-password"
                  hasError={showError}
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="p-2 rounded-lg transition-all hover:opacity-70 active:scale-90"
                      style={{ color: "rgba(148,163,184,0.6)" }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={showPassword ? "off" : "on"}
                          initial={{ opacity: 0, rotate: -18, scale: 0.65 }}
                          animate={{ opacity: 1, rotate: 0, scale: 1 }}
                          exit={{ opacity: 0, rotate: 18, scale: 0.65 }}
                          transition={{ duration: 0.14 }}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.div>
                      </AnimatePresence>
                    </button>
                  }
                />
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.56 }}
                className="mt-7"
              >
                <motion.button
                  type="submit"
                  disabled={submitting || !username || !password || showError || showSuccess}
                  className="relative w-full font-bold overflow-hidden disabled:opacity-35 disabled:cursor-not-allowed"
                  style={{ color: "#fff", padding: "17px 0", fontSize: "16px", borderRadius: "14px" }}
                  whileHover={!submitting ? { scale: 1.012 } : {}}
                  whileTap={!submitting ? { scale: 0.988 } : {}}
                >
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(135deg, #1A65FF 0%, #2563EB 65%, #1D4FCC 100%)",
                    boxShadow: !submitting && username && password
                      ? "0 8px 32px rgba(21,93,252,0.45), 0 2px 10px rgba(21,93,252,0.3), inset 0 1px 0 rgba(255,255,255,0.18)"
                      : "none",
                    borderRadius: "14px",
                  }} />
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                    style={{ background: "linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.12) 50%, transparent 72%)" }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2.5">
                    <AnimatePresence mode="wait">
                      {submitting ? (
                        <motion.span key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verificando…
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2">
                          Ingresar
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              </motion.div>
            </form>

            {/* Bottom divider */}
            <div className="mx-6 sm:mx-11 mb-7" style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.2) 40%, rgba(96,165,250,0.12) 60%, transparent)",
            }} />
          </div>
        </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="mt-6 lg:absolute lg:bottom-5 tracking-wide"
          style={{ fontSize: "12px", color: "rgba(148,163,184,0.28)" }}
        >
          © {new Date().getFullYear()} Compers · Todos los derechos reservados
        </motion.p>
      </div>
    </div>
  );
}
