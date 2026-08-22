import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import {
  LayoutDashboard, Users, Clock, Calendar, DollarSign, Bell, LogOut,
  Menu, X, Search, Plus, Edit2, Eye, CheckCircle, XCircle, FileText,
  ChevronLeft, User, AlertCircle, Phone, Mail, MapPin, TrendingUp,
  Download,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Constants ──────────────────────────────────────────────────────────────

const M = "#641F2B"; // deep maroon primary
const BEIGE = "#EDE3D5";
const IVORY = "#F7F2EA";
const CARD = "#FFFDFC";
const BROWN = "#2F2420";
const MUTED = "#806D63";
const BORDER = "rgba(160,130,110,0.2)";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "employee" | "hr";

interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  initials: string;
  department: string;
  designation: string;
  status: "Active" | "Inactive";
  joiningDate: string;
  employmentType: string;
  manager: string;
  phone: string;
  address: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "Paid Leave" | "Sick Leave" | "Unpaid Leave";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  comment?: string;
  submittedOn: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hours: string | null;
  status: "Present" | "Absent" | "Half-day" | "Leave";
}

interface CheckInState {
  checkedIn: boolean;
  checkInTime: string | null;
  checkedOut: boolean;
  checkOutTime: string | null;
}

interface AppNotification {
  id: string;
  employeeId: string;
  message: string;
  read: boolean;
  time: string;
  type: "leave" | "attendance" | "system";
}

interface Salary {
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  net: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INIT_EMPLOYEES: Employee[] = [
  { id: "EMP001", name: "Rahul Sharma", email: "employee@dayflow.com", password: "password", role: "employee", initials: "RS", department: "Engineering", designation: "Software Engineer", status: "Active", joiningDate: "2022-03-15", employmentType: "Full-time", manager: "Ananya Patil", phone: "+91 98765 43210", address: "123 MG Road, Bangalore, Karnataka 560001" },
  { id: "EMP002", name: "Ananya Patil", email: "hr@dayflow.com", password: "password", role: "hr", initials: "AP", department: "Human Resources", designation: "HR Executive", status: "Active", joiningDate: "2021-06-01", employmentType: "Full-time", manager: "Vikram Nair", phone: "+91 87654 32109", address: "45 Juhu Beach Road, Mumbai, Maharashtra 400049" },
  { id: "EMP003", name: "Arjun Mehta", email: "arjun@dayflow.com", password: "password", role: "employee", initials: "AM", department: "Design", designation: "UI Designer", status: "Active", joiningDate: "2023-01-10", employmentType: "Full-time", manager: "Ananya Patil", phone: "+91 76543 21098", address: "78 Anna Nagar, Chennai, Tamil Nadu 600040" },
  { id: "EMP004", name: "Priya Nair", email: "priya@dayflow.com", password: "password", role: "employee", initials: "PN", department: "Marketing", designation: "Marketing Executive", status: "Active", joiningDate: "2022-08-22", employmentType: "Full-time", manager: "Ananya Patil", phone: "+91 65432 10987", address: "12 Banjara Hills, Hyderabad, Telangana 500034" },
  { id: "EMP005", name: "Rohan Desai", email: "rohan@dayflow.com", password: "password", role: "employee", initials: "RD", department: "Engineering", designation: "Backend Developer", status: "Active", joiningDate: "2021-11-15", employmentType: "Full-time", manager: "Rahul Sharma", phone: "+91 54321 09876", address: "56 Koregaon Park, Pune, Maharashtra 411001" },
];

const INIT_SALARIES: Record<string, Salary> = {
  EMP001: { basic: 75000, hra: 30000, allowances: 15000, deductions: 8500, net: 111500 },
  EMP002: { basic: 65000, hra: 26000, allowances: 12000, deductions: 7200, net: 95800 },
  EMP003: { basic: 55000, hra: 22000, allowances: 10000, deductions: 6100, net: 80900 },
  EMP004: { basic: 45000, hra: 18000, allowances: 8000, deductions: 5300, net: 65700 },
  EMP005: { basic: 70000, hra: 28000, allowances: 13000, deductions: 7900, net: 103100 },
};

const INIT_LEAVES: LeaveRequest[] = [
  { id: "LR001", employeeId: "EMP003", employeeName: "Arjun Mehta", leaveType: "Sick Leave", startDate: "2026-08-10", endDate: "2026-08-11", days: 2, reason: "Fever and cold", status: "Approved", comment: "Approved. Take care.", submittedOn: "2026-08-09" },
  { id: "LR002", employeeId: "EMP004", employeeName: "Priya Nair", leaveType: "Paid Leave", startDate: "2026-08-25", endDate: "2026-08-26", days: 2, reason: "Family function", status: "Pending", submittedOn: "2026-08-18" },
  { id: "LR003", employeeId: "EMP005", employeeName: "Rohan Desai", leaveType: "Unpaid Leave", startDate: "2026-08-28", endDate: "2026-08-28", days: 1, reason: "Personal work", status: "Pending", submittedOn: "2026-08-20" },
  { id: "LR004", employeeId: "EMP001", employeeName: "Rahul Sharma", leaveType: "Paid Leave", startDate: "2026-07-14", endDate: "2026-07-16", days: 3, reason: "Family vacation", status: "Approved", comment: "Approved. Enjoy!", submittedOn: "2026-07-10" },
  { id: "LR005", employeeId: "EMP001", employeeName: "Rahul Sharma", leaveType: "Sick Leave", startDate: "2026-06-03", endDate: "2026-06-03", days: 1, reason: "Not feeling well", status: "Rejected", comment: "Insufficient notice period.", submittedOn: "2026-06-03" },
  { id: "LR006", employeeId: "EMP001", employeeName: "Rahul Sharma", leaveType: "Paid Leave", startDate: "2026-09-05", endDate: "2026-09-07", days: 3, reason: "Diwali celebrations", status: "Approved", comment: "Approved!", submittedOn: "2026-08-15" },
];

const INIT_ATTENDANCE: AttendanceRecord[] = [
  { id: "A001", employeeId: "EMP001", date: "2026-08-21", checkIn: "9:05 AM", checkOut: "6:10 PM", hours: "9h 05m", status: "Present" },
  { id: "A002", employeeId: "EMP001", date: "2026-08-20", checkIn: "9:22 AM", checkOut: "6:00 PM", hours: "8h 38m", status: "Present" },
  { id: "A003", employeeId: "EMP001", date: "2026-08-19", checkIn: "9:10 AM", checkOut: "6:15 PM", hours: "9h 05m", status: "Present" },
  { id: "A004", employeeId: "EMP001", date: "2026-08-18", checkIn: null, checkOut: null, hours: null, status: "Absent" },
  { id: "A005", employeeId: "EMP001", date: "2026-08-15", checkIn: "9:30 AM", checkOut: "1:30 PM", hours: "4h 00m", status: "Half-day" },
  { id: "A006", employeeId: "EMP001", date: "2026-08-14", checkIn: null, checkOut: null, hours: null, status: "Leave" },
  { id: "A007", employeeId: "EMP001", date: "2026-08-13", checkIn: "8:55 AM", checkOut: "6:05 PM", hours: "9h 10m", status: "Present" },
  { id: "A008", employeeId: "EMP001", date: "2026-08-12", checkIn: "9:02 AM", checkOut: "6:00 PM", hours: "8h 58m", status: "Present" },
  { id: "A009", employeeId: "EMP001", date: "2026-08-11", checkIn: "9:18 AM", checkOut: "6:10 PM", hours: "8h 52m", status: "Present" },
  // Other employees for today
  { id: "A010", employeeId: "EMP002", date: "2026-08-22", checkIn: "8:45 AM", checkOut: null, hours: null, status: "Present" },
  { id: "A011", employeeId: "EMP003", date: "2026-08-22", checkIn: "9:15 AM", checkOut: null, hours: null, status: "Present" },
  { id: "A012", employeeId: "EMP004", date: "2026-08-22", checkIn: null, checkOut: null, hours: null, status: "Absent" },
  { id: "A013", employeeId: "EMP005", date: "2026-08-22", checkIn: "8:50 AM", checkOut: null, hours: null, status: "Present" },
];

const INIT_NOTIFICATIONS: AppNotification[] = [
  { id: "N001", employeeId: "EMP001", message: "Your leave request for Jul 14–16 has been approved.", read: false, time: "5 weeks ago", type: "leave" },
  { id: "N002", employeeId: "EMP001", message: "You checked in at 9:05 AM on Aug 21.", read: true, time: "Yesterday", type: "attendance" },
  { id: "N003", employeeId: "EMP001", message: "Your leave request for Jun 3 was rejected.", read: true, time: "2 months ago", type: "leave" },
  { id: "N004", employeeId: "EMP002", message: "New leave request from Priya Nair (Aug 25–26).", read: false, time: "4 days ago", type: "leave" },
  { id: "N005", employeeId: "EMP002", message: "New leave request from Rohan Desai (Aug 28).", read: false, time: "2 days ago", type: "leave" },
];

const WEEKLY_CHART_DATA = [
  { day: "Mon", Present: 102, Absent: 8, "Half-day": 6, Leave: 8 },
  { day: "Tue", Present: 108, Absent: 5, "Half-day": 4, Leave: 7 },
  { day: "Wed", Present: 105, Absent: 9, "Half-day": 5, Leave: 5 },
  { day: "Thu", Present: 110, Absent: 4, "Half-day": 3, Leave: 7 },
  { day: "Fri", Present: 98, Absent: 12, "Half-day": 8, Leave: 6 },
];

const EMP_WEEKLY = [
  { day: "Mon", status: "Present" },
  { day: "Tue", status: "Present" },
  { day: "Wed", status: "Half-day" },
  { day: "Thu", status: "Present" },
  { day: "Fri", status: "Present" },
  { day: "Sat", status: "Off" },
  { day: "Sun", status: "Off" },
];

// ─── Utility Components ───────────────────────────────────────────────────────

function Av({ initials, size = "md" }: { initials: string; size?: "xs" | "sm" | "md" | "lg" | "xl" }) {
  const s = { xs: "w-6 h-6 text-[10px]", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-xl" };
  return (
    <div className={`${s[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`} style={{ backgroundColor: M }}>
      {initials}
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    "Half-day": "bg-amber-100 text-amber-700",
    Leave: "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-600",
    Paid: "bg-green-100 text-green-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl shadow-sm border ${className}`} style={{ backgroundColor: CARD, borderColor: BORDER }}>
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ backgroundColor: CARD }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: BORDER }}>
          <h2 className="text-base font-semibold" style={{ color: BROWN }}>{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: MUTED }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = BEIGE)} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            <X size={17} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, disabled, required }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: BROWN }}>
        {label}{required && <span style={{ color: M }} className="ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{ border: `1px solid ${BORDER}`, backgroundColor: disabled ? BEIGE : "#fff", color: disabled ? MUTED : BROWN }}
        onFocus={e => { e.currentTarget.style.borderColor = M; e.currentTarget.style.boxShadow = `0 0 0 3px ${M}20`; }}
        onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function Sel({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium" style={{ color: BROWN }}>
        {label}{required && <span style={{ color: M }} className="ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
        style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
      >
        <option value="">Select {label}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "primary", type = "button", className = "" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost"; type?: "button" | "submit"; className?: string;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: disabled ? "#9b7b82" : M, color: "#fff", border: "none" },
    secondary: { backgroundColor: "transparent", color: MUTED, border: `1px solid ${BORDER}` },
    danger: { backgroundColor: "#dc2626", color: "#fff", border: "none" },
    ghost: { backgroundColor: "transparent", color: MUTED, border: "none" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
      style={styles[variant]}
    >
      {children}
    </button>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin }: { onLogin: (emp: Employee) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = INIT_EMPLOYEES.find(emp => emp.email === email && emp.password === password);
      if (user) onLogin(user);
      else setError("Invalid email or password. Please try again.");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: IVORY }}>
      {/* Form side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: M }}>
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: BROWN }}>Dayflow</span>
            </div>
            <p className="text-sm italic pl-13" style={{ color: MUTED }}>"Every workday, perfectly aligned."</p>
          </div>

          <div>
            <h1 className="text-2xl font-semibold" style={{ color: BROWN }}>Welcome back</h1>
            <p className="text-sm mt-1" style={{ color: MUTED }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: BROWN }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@dayflow.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
                onFocus={e => { e.currentTarget.style.borderColor = M; e.currentTarget.style.boxShadow = `0 0 0 3px ${M}18`; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: BROWN }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
                onFocus={e => { e.currentTarget.style.borderColor = M; e.currentTarget.style.boxShadow = `0 0 0 3px ${M}18`; }}
                onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: MUTED }}>
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: M }} />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium" style={{ color: M }}>Forgot password?</button>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-medium text-sm transition-opacity disabled:opacity-70"
              style={{ backgroundColor: M }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: MUTED }}>
            {"Don't have an account? "}
            <button className="font-medium" style={{ color: M }}>Sign up</button>
          </p>

          {/* Demo credentials */}
          <div className="p-4 rounded-xl space-y-2.5" style={{ backgroundColor: BEIGE, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Demo Credentials</p>
            <button
              type="button"
              onClick={() => { setEmail("employee@dayflow.com"); setPassword("password"); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors"
              style={{ backgroundColor: CARD, color: BROWN, border: `1px solid ${BORDER}` }}
            >
              <span className="font-semibold">Employee —</span> employee@dayflow.com / password
            </button>
            <button
              type="button"
              onClick={() => { setEmail("hr@dayflow.com"); setPassword("password"); }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors"
              style={{ backgroundColor: CARD, color: BROWN, border: `1px solid ${BORDER}` }}
            >
              <span className="font-semibold">HR Admin —</span> hr@dayflow.com / password
            </button>
          </div>
        </div>
      </div>

      {/* Brand panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-16" style={{ backgroundColor: BROWN }}>
        <div className="max-w-sm space-y-8 w-full">
          <div className="space-y-3">
            {[
              { initials: "RS", name: "Rahul Sharma", role: "Software Engineer", status: "Present" },
              { initials: "AP", name: "Ananya Patil", role: "HR Executive", status: "Present" },
              { initials: "PN", name: "Priya Nair", role: "Marketing Executive", status: "On Leave" },
            ].map(emp => (
              <div key={emp.name} className="flex items-center gap-3.5 p-4 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: M }}>
                  {emp.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{emp.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#a0897e" }}>{emp.role}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${emp.status === "Present" ? "bg-green-900/50 text-green-300" : "bg-amber-900/50 text-amber-300"}`}>
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-center">
            <h2 className="text-2xl font-semibold text-white">Your people, your priority.</h2>
            <p className="text-sm leading-relaxed" style={{ color: "#a0897e" }}>
              Dayflow brings attendance, leaves, payroll, and team management into one calm, organized workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: "Employees", val: "124" }, { label: "Present Today", val: "108" }, { label: "On Leave", val: "8" }].map(s => (
              <div key={s.label} className="p-4 rounded-xl text-center" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="text-xl font-bold text-white">{s.val}</div>
                <div className="text-xs mt-1" style={{ color: "#a0897e" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ role, page, setPage, user, onLogout, mobileOpen, closeMobile }: {
  role: Role; page: string; setPage: (p: string) => void;
  user: Employee; onLogout: () => void; mobileOpen: boolean; closeMobile: () => void;
}) {
  const empNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile", label: "My Profile", icon: User },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "leave", label: "Leave", icon: Calendar },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];
  const hrNav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "employees", label: "Employees", icon: Users },
    { id: "hr-attendance", label: "Attendance", icon: Clock },
    { id: "leave-requests", label: "Leave Requests", icon: Calendar },
    { id: "payroll", label: "Payroll", icon: DollarSign },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];
  const nav = role === "hr" ? hrNav : empNav;

  const Inner = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: M }}>
            <span className="text-white font-bold">D</span>
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: BROWN }}>Dayflow</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{role === "hr" ? "HR Admin" : "Employee"}</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(item => {
          const Icon = item.icon;
          const active = page === item.id || (item.id === "employees" && page === "employee-profile");
          return (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); closeMobile(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={active ? { backgroundColor: M, color: "#fff" } : { color: MUTED }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = BEIGE; e.currentTarget.style.color = BROWN; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = MUTED; } }}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t space-y-3" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 px-3 py-1">
          <Av initials={user.initials} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: BROWN }}>{user.name}</div>
            <div className="text-xs truncate" style={{ color: MUTED }}>{user.designation}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
          style={{ color: MUTED }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = MUTED; }}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r flex-shrink-0" style={{ backgroundColor: CARD, borderColor: BORDER }}>
        <Inner />
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
          <div className="relative w-60 h-full flex flex-col border-r" style={{ backgroundColor: CARD, borderColor: BORDER }}>
            <button onClick={closeMobile} className="absolute top-4 right-4 p-1.5 rounded-lg" style={{ color: MUTED }}>
              <X size={17} />
            </button>
            <Inner />
          </div>
        </div>
      )}
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ title, user, unread, onMenu, setPage }: {
  title: string; user: Employee; unread: number; onMenu: () => void; setPage: (p: string) => void;
}) {
  return (
    <header className="h-14 flex items-center justify-between px-5 border-b sticky top-0 z-40" style={{ backgroundColor: CARD, borderColor: BORDER }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="lg:hidden p-1.5 rounded-lg" style={{ color: MUTED }}>
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold" style={{ color: BROWN }}>{title}</h1>
      </div>
      <div className="flex items-center gap-2.5">
        <button onClick={() => setPage("notifications")} className="relative p-2 rounded-lg transition-colors" style={{ color: MUTED }}>
          <Bell size={19} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: M }}>
              {unread}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2.5">
          <Av initials={user.initials} size="sm" />
          <div className="hidden sm:block">
            <div className="text-sm font-medium leading-none" style={{ color: BROWN }}>{user.name}</div>
            <div className="text-xs mt-0.5" style={{ color: MUTED }}>{user.role === "hr" ? "HR Admin" : "Employee"}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Employee Dashboard ───────────────────────────────────────────────────────

function EmpDashboard({ user, leaves, cis, onCheckIn, onCheckOut }: {
  user: Employee; leaves: LeaveRequest[]; cis: CheckInState; onCheckIn: () => void; onCheckOut: () => void;
}) {
  const myLeaves = leaves.filter(l => l.employeeId === user.id);
  const approved = myLeaves.filter(l => l.status === "Approved");
  const paidUsed = approved.filter(l => l.leaveType === "Paid Leave").reduce((a, b) => a + b.days, 0);
  const sickUsed = approved.filter(l => l.leaveType === "Sick Leave").reduce((a, b) => a + b.days, 0);
  const pending = myLeaves.filter(l => l.status === "Pending");
  const upcoming = myLeaves.filter(l => l.status === "Approved" && l.startDate > "2026-08-22").slice(0, 2);

  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const wkColors: Record<string, string> = {
    Present: "#4ade80", Absent: "#f87171", "Half-day": "#fbbf24", Leave: "#60a5fa", Off: BEIGE,
  };

  const activity = [
    cis.checkedIn ? { icon: "✓", text: `Checked in at ${cis.checkInTime}`, time: "Today" } : null,
    { icon: "📋", text: "Leave request submitted (Jul 14–16)", time: "5 weeks ago" },
    { icon: "✅", text: "Leave request approved (Jul 14–16)", time: "5 weeks ago" },
    { icon: "👤", text: "Profile updated", time: "2 months ago" },
  ].filter(Boolean) as { icon: string; text: string; time: string }[];

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: BROWN }}>{greeting}, {user.name.split(" ")[0]}.</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>{"Here's your workday overview."}</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: BEIGE }}>
              <Clock size={17} style={{ color: M }} />
            </div>
            <Badge status={cis.checkedIn ? "Present" : "Absent"} />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>{"Today's Attendance"}</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Check-in</span><span className="font-medium" style={{ color: BROWN }}>{cis.checkInTime || "—"}</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Check-out</span><span className="font-medium" style={{ color: BROWN }}>{cis.checkOutTime || "—"}</span></div>
            {cis.checkedOut && <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Hours</span><span className="font-medium" style={{ color: BROWN }}>8h 52m</span></div>}
          </div>
        </Card>

        <Card className="p-5">
          <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: BEIGE }}>
            <Calendar size={17} style={{ color: M }} />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>Leave Balance</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Paid Leave</span><span className="font-medium" style={{ color: BROWN }}>{12 - paidUsed} days</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Sick Leave</span><span className="font-medium" style={{ color: BROWN }}>{6 - sickUsed} days</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Unpaid</span><span className="font-medium" style={{ color: BROWN }}>Unlimited</span></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: BEIGE }}>
            <AlertCircle size={17} style={{ color: M }} />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>Pending Requests</div>
          <div className="text-3xl font-bold" style={{ color: BROWN }}>{pending.length}</div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>Leave requests pending</div>
        </Card>

        <Card className="p-5">
          <div className="p-2 rounded-lg w-fit mb-3" style={{ backgroundColor: BEIGE }}>
            <TrendingUp size={17} style={{ color: M }} />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>This Month</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Present</span><span className="font-medium text-green-600">17 days</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Absent</span><span className="font-medium text-red-600">1 day</span></div>
            <div className="flex justify-between text-sm"><span style={{ color: MUTED }}>Leave</span><span className="font-medium text-blue-600">2 days</span></div>
          </div>
        </Card>
      </div>

      {/* Check In / Out */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold" style={{ color: BROWN }}>Daily Attendance</h3>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>
              {!cis.checkedIn && "Not checked in yet"}
              {cis.checkedIn && !cis.checkedOut && `Checked in at ${cis.checkInTime}`}
              {cis.checkedOut && `Checked out at ${cis.checkOutTime} · 8h 52m today`}
            </p>
          </div>
          {!cis.checkedIn && (
            <button onClick={onCheckIn} className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: M }}>
              <Clock size={16} /> Check In
            </button>
          )}
          {cis.checkedIn && !cis.checkedOut && (
            <button onClick={onCheckOut} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border-2" style={{ color: M, borderColor: M }}>
              <Clock size={16} /> Check Out
            </button>
          )}
          {cis.checkedOut && (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <CheckCircle size={16} /> Day Complete
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Overview */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Attendance Overview — This Week</h3>
          <div className="flex items-end gap-2">
            {EMP_WEEKLY.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-9 rounded-lg" style={{ backgroundColor: wkColors[d.status] || BEIGE }} />
                <span className="text-xs" style={{ color: MUTED }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {Object.entries({ Present: "#4ade80", Absent: "#f87171", "Half-day": "#fbbf24", Leave: "#60a5fa" }).map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-xs" style={{ color: MUTED }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Recent Activity</h3>
          <div className="space-y-3.5">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: BEIGE }}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-sm leading-snug" style={{ color: BROWN }}>{a.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Leave */}
      {upcoming.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Upcoming Leave</h3>
          <div className="space-y-3">
            {upcoming.map(l => (
              <div key={l.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: IVORY }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: BROWN }}>{l.leaveType}</div>
                  <div className="text-xs mt-0.5" style={{ color: MUTED }}>{l.startDate} — {l.endDate} · {l.days} days</div>
                </div>
                <Badge status={l.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Employee Profile ─────────────────────────────────────────────────────────

function EmpProfile({ user, employees, salaries, onUpdate }: {
  user: Employee; employees: Employee[]; salaries: Record<string, Salary>;
  onUpdate: (emp: Employee) => void;
}) {
  const emp = employees.find(e => e.id === user.id) || user;
  const salary = salaries[emp.id];
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState(emp.phone);
  const [address, setAddress] = useState(emp.address);

  const save = () => {
    onUpdate({ ...emp, phone, address });
    setEditOpen(false);
    toast.success("Profile updated successfully.");
  };

  const docs = [
    { name: "Offer Letter", date: "Mar 15, 2022" },
    { name: "Identity Document", date: "Mar 15, 2022" },
    { name: "Joining Documents", date: "Mar 15, 2022" },
  ];

  return (
    <div className="p-5 md:p-6 space-y-6">
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Av initials={emp.initials} size="xl" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold" style={{ color: BROWN }}>{emp.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>{emp.designation}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-sm" style={{ color: MUTED }}>{emp.department}</span>
              <span className="text-sm" style={{ color: MUTED }}>·</span>
              <span className="text-sm" style={{ color: MUTED }}>{emp.id}</span>
              <Badge status={emp.status} />
            </div>
          </div>
          <button
            onClick={() => { setPhone(emp.phone); setAddress(emp.address); setEditOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors"
            style={{ color: MUTED, borderColor: BORDER }}
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Personal Information</h3>
          <div className="space-y-3.5">
            {[
              { label: "Full Name", value: emp.name, Icon: User },
              { label: "Email", value: emp.email, Icon: Mail },
              { label: "Phone", value: emp.phone, Icon: Phone },
              { label: "Address", value: emp.address, Icon: MapPin },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: MUTED }} />
                <div>
                  <div className="text-xs" style={{ color: MUTED }}>{label}</div>
                  <div className="text-sm mt-0.5" style={{ color: BROWN }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Job Information</h3>
          <div className="space-y-2.5">
            {[
              { label: "Employee ID", value: emp.id },
              { label: "Department", value: emp.department },
              { label: "Designation", value: emp.designation },
              { label: "Joining Date", value: emp.joiningDate },
              { label: "Employment Type", value: emp.employmentType },
              { label: "Reporting Manager", value: emp.manager },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span style={{ color: MUTED }}>{label}</span>
                <span className="font-medium" style={{ color: BROWN }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Salary Information</h3>
          <div className="space-y-2.5">
            {[
              { label: "Basic Salary", value: `₹${salary?.basic.toLocaleString()}`, sign: "+" },
              { label: "HRA", value: `₹${salary?.hra.toLocaleString()}`, sign: "+" },
              { label: "Allowances", value: `₹${salary?.allowances.toLocaleString()}`, sign: "+" },
              { label: "Deductions", value: `₹${salary?.deductions.toLocaleString()}`, sign: "-" },
            ].map(({ label, value, sign }) => (
              <div key={label} className="flex justify-between text-sm border-b pb-2" style={{ borderColor: BORDER }}>
                <span style={{ color: MUTED }}>{label}</span>
                <span className={`font-medium ${sign === "-" ? "text-red-600" : "text-green-600"}`}>{sign}{value}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold pt-1">
              <span style={{ color: BROWN }}>Net Salary</span>
              <span style={{ color: M }}>₹{salary?.net.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Documents</h3>
          <div className="space-y-3">
            {docs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: IVORY }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: CARD }}>
                    <FileText size={15} style={{ color: M }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: BROWN }}>{doc.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: MUTED }}>Added {doc.date}</div>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg transition-colors" style={{ color: MUTED }}>
                  <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: MUTED }}>You can update your phone number, address, and profile picture.</p>
          <Field label="Phone Number" value={phone} onChange={setPhone} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: BROWN }}>Address</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none h-20"
              style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Btn variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Changes</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Employee Attendance ──────────────────────────────────────────────────────

function EmpAttendance({ user, attendance, cis }: {
  user: Employee; attendance: AttendanceRecord[]; cis: CheckInState;
}) {
  const [tab, setTab] = useState<"today" | "week" | "month">("month");
  const mine = attendance.filter(a => a.employeeId === user.id);
  const today = new Date();

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Attendance</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Your attendance records</p>
      </div>

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm" style={{ color: MUTED }}>
              {today.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div className="mt-2"><Badge status={cis.checkedIn ? "Present" : "Absent"} /></div>
          </div>
          <div className="flex gap-6">
            {[{ label: "Check-in", value: cis.checkInTime }, { label: "Check-out", value: cis.checkOutTime }, { label: "Hours", value: cis.checkedOut ? "8h 52m" : null }].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-xs" style={{ color: MUTED }}>{label}</div>
                <div className="text-sm font-semibold mt-1" style={{ color: BROWN }}>{value || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: BEIGE }}>
        {(["today", "week", "month"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t ? { backgroundColor: CARD, color: BROWN, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" } : { color: MUTED }}
          >
            {t === "today" ? "Today" : t === "week" ? "This Week" : "This Month"}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Date", "Check-in", "Check-out", "Working Hours", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mine.map((rec, i) => (
                <tr key={rec.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{rec.date}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{rec.checkIn || "—"}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{rec.checkOut || "—"}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{rec.hours || "—"}</td>
                  <td className="px-4 py-3"><Badge status={rec.status} /></td>
                </tr>
              ))}
              {mine.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: MUTED }}>No attendance records.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Employee Leave ───────────────────────────────────────────────────────────

function EmpLeave({ user, leaves, onSubmit }: {
  user: Employee; leaves: LeaveRequest[];
  onSubmit: (l: Omit<LeaveRequest, "id" | "employeeName" | "submittedOn" | "status">) => void;
}) {
  const mine = leaves.filter(l => l.employeeId === user.id);
  const approved = mine.filter(l => l.status === "Approved");
  const paidUsed = approved.filter(l => l.leaveType === "Paid Leave").reduce((a, b) => a + b.days, 0);
  const sickUsed = approved.filter(l => l.leaveType === "Sick Leave").reduce((a, b) => a + b.days, 0);
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [reason, setReason] = useState("");

  const days = start && end ? Math.max(0, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1) : 0;

  const submit = () => {
    if (!leaveType || !start || !end || !reason) { toast.error("Please fill in all required fields."); return; }
    onSubmit({ employeeId: user.id, leaveType: leaveType as LeaveRequest["leaveType"], startDate: start, endDate: end, days, reason });
    setLeaveType(""); setStart(""); setEnd(""); setReason("");
    setOpen(false);
    toast.success("Leave request submitted successfully.");
  };

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Leave Management</h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>Manage your leave requests</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: M }}>
          <Plus size={15} /> Apply for Leave
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Paid Leave Remaining", value: `${12 - paidUsed} days`, cls: "text-green-600" },
          { label: "Sick Leave Remaining", value: `${6 - sickUsed} days`, cls: "text-blue-600" },
          { label: "Unpaid Leave", value: "Unlimited", cls: "text-[#806D63]" },
          { label: "Pending Requests", value: `${mine.filter(l => l.status === "Pending").length}`, cls: "text-amber-600" },
        ].map(({ label, value, cls }) => (
          <Card key={label} className="p-4">
            <div className="text-xs font-medium" style={{ color: MUTED }}>{label}</div>
            <div className={`text-xl font-bold mt-1 ${cls}`}>{value}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="font-semibold" style={{ color: BROWN }}>Leave History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Leave Type", "Date Range", "Days", "Reason", "Status", "Comments"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mine.map(l => (
                <tr key={l.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: BROWN }}>{l.leaveType}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: BROWN }}>{l.startDate} — {l.endDate}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{l.days}</td>
                  <td className="px-4 py-3 text-sm max-w-[140px] truncate" style={{ color: MUTED }}>{l.reason}</td>
                  <td className="px-4 py-3"><Badge status={l.status} /></td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{l.comment || "—"}</td>
                </tr>
              ))}
              {mine.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: MUTED }}>No leave history.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Apply for Leave">
        <div className="space-y-4">
          <Sel label="Leave Type" value={leaveType} onChange={setLeaveType} options={["Paid Leave", "Sick Leave", "Unpaid Leave"]} required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" type="date" value={start} onChange={setStart} required />
            <Field label="End Date" type="date" value={end} onChange={setEnd} required />
          </div>
          {days > 0 && (
            <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: BEIGE, color: MUTED }}>
              Duration: <strong style={{ color: BROWN }}>{days} day{days > 1 ? "s" : ""}</strong>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: BROWN }}>Remarks <span style={{ color: M }}>*</span></label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Please provide a reason for your leave request…"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none h-20"
              style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Btn variant="secondary" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn onClick={submit}>Submit Request</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Employee Payroll ─────────────────────────────────────────────────────────

function EmpPayroll({ user, salaries }: { user: Employee; salaries: Record<string, Salary> }) {
  const s = salaries[user.id];
  const history = [
    { month: "Aug 2026", status: "Pending" }, { month: "Jul 2026", status: "Paid" },
    { month: "Jun 2026", status: "Paid" }, { month: "May 2026", status: "Paid" },
    { month: "Apr 2026", status: "Paid" },
  ];

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Payroll</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Your salary information (read-only)</p>
      </div>

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm" style={{ color: MUTED }}>Current Month Net Salary</div>
            <div className="text-3xl font-bold mt-1" style={{ color: BROWN }}>₹{s?.net.toLocaleString()}</div>
            <div className="text-sm mt-1" style={{ color: MUTED }}>August 2026</div>
          </div>
          <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Pending Payment</div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Salary Breakdown</h3>
          <div className="space-y-2.5">
            {[
              { label: "Basic Salary", value: s?.basic, cls: "text-green-600", sign: "+" },
              { label: "HRA", value: s?.hra, cls: "text-green-600", sign: "+" },
              { label: "Allowances", value: s?.allowances, cls: "text-green-600", sign: "+" },
              { label: "Deductions", value: s?.deductions, cls: "text-red-600", sign: "-" },
            ].map(({ label, value, cls, sign }) => (
              <div key={label} className="flex justify-between text-sm pb-2 border-b" style={{ borderColor: BORDER }}>
                <span style={{ color: MUTED }}>{label}</span>
                <span className={`font-medium ${cls}`}>{sign}₹{value?.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold pt-1">
              <span style={{ color: BROWN }}>Net Salary</span>
              <span style={{ color: M }}>₹{s?.net.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {[
            { label: "Annual CTC", value: `₹${((s?.net || 0) * 12).toLocaleString()}` },
            { label: "Total Gross Earnings", value: `₹${((s?.basic || 0) + (s?.hra || 0) + (s?.allowances || 0)).toLocaleString()}` },
            { label: "Total Deductions", value: `₹${s?.deductions.toLocaleString()}` },
          ].map(({ label, value }) => (
            <Card key={label} className="p-4 flex justify-between items-center">
              <span className="text-sm" style={{ color: MUTED }}>{label}</span>
              <span className="text-sm font-semibold" style={{ color: BROWN }}>{value}</span>
            </Card>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="font-semibold" style={{ color: BROWN }}>Payroll History</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: IVORY }}>
              {["Month", "Basic Salary", "Net Salary", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map(row => (
              <tr key={row.month} className="border-t" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: BROWN }}>{row.month}</td>
                <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>₹{s?.basic.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>₹{s?.net.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge status={row.status === "Paid" ? "Approved" : "Pending"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Notifications Page ───────────────────────────────────────────────────────

function NotifPage({ user, notifications, onMark }: {
  user: Employee; notifications: AppNotification[]; onMark: (id: string) => void;
}) {
  const mine = notifications.filter(n => n.employeeId === user.id);
  const hasUnread = mine.some(n => !n.read);

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Notifications</h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>Stay updated on your activities</p>
        </div>
        {hasUnread && (
          <button onClick={() => mine.filter(n => !n.read).forEach(n => onMark(n.id))} className="text-sm font-medium" style={{ color: M }}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {mine.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell size={32} className="mx-auto mb-3" style={{ color: MUTED }} />
            <p style={{ color: MUTED }}>No notifications yet</p>
          </Card>
        ) : mine.map(n => (
          <div
            key={n.id}
            onClick={() => onMark(n.id)}
            className="cursor-pointer rounded-xl shadow-sm transition-all"
            style={{
              backgroundColor: CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: !n.read ? `3px solid ${M}` : `1px solid ${BORDER}`,
            }}
          >
            <div className="flex items-start gap-3 p-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "leave" ? "bg-blue-100" : "bg-green-100"}`}>
                {n.type === "leave" ? <Calendar size={14} className="text-blue-600" /> : <Clock size={14} className="text-green-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: n.read ? MUTED : BROWN, fontWeight: n.read ? 400 : 500 }}>{n.message}</p>
                <p className="text-xs mt-0.5" style={{ color: MUTED }}>{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: M }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HR Dashboard ─────────────────────────────────────────────────────────────

function HRDash({ user, employees, leaves, onApprove, onReject, setPage, setSelEmp }: {
  user: Employee; employees: Employee[]; leaves: LeaveRequest[];
  onApprove: (id: string) => void; onReject: (id: string, c: string) => void;
  setPage: (p: string) => void; setSelEmp: (id: string) => void;
}) {
  const pending = leaves.filter(l => l.status === "Pending");
  const onLeave = leaves.filter(l => l.status === "Approved" && l.startDate <= "2026-08-22" && l.endDate >= "2026-08-22");
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: BROWN }}>{greeting}, {user.name.split(" ")[0]}.</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>{"Here's your workforce overview."}</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: employees.length, sub: "Active workforce", Icon: Users, cls: "text-blue-600", bg: "bg-blue-50" },
          { label: "Present Today", value: 108, sub: "+3 from yesterday", Icon: CheckCircle, cls: "text-green-600", bg: "bg-green-50" },
          { label: "On Leave", value: onLeave.length, sub: "Approved leaves", Icon: Calendar, cls: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Requests", value: pending.length, sub: "Needs attention", Icon: AlertCircle, cls: "text-red-600", bg: "bg-red-50" },
        ].map(({ label, value, sub, Icon, cls, bg }) => (
          <Card key={label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium" style={{ color: MUTED }}>{label}</div>
                <div className="text-3xl font-bold mt-1" style={{ color: BROWN }}>{value}</div>
                <div className="text-xs mt-1" style={{ color: MUTED }}>{sub}</div>
              </div>
              <div className={`p-2.5 rounded-xl ${bg}`}>
                <Icon size={20} className={cls} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Attendance Overview — This Week</h3>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={WEEKLY_CHART_DATA} barSize={9} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160,130,110,0.12)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "8px", border: `1px solid ${BORDER}`, fontSize: "12px", backgroundColor: CARD }} />
              <Bar dataKey="Present" fill="#4ade80" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Absent" fill="#f87171" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Half-day" fill="#fbbf24" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Leave" fill="#60a5fa" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {[["Present", "#4ade80"], ["Absent", "#f87171"], ["Half-day", "#fbbf24"], ["Leave", "#60a5fa"]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                <span className="text-xs" style={{ color: MUTED }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Directory */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Team Directory</h3>
          <div className="space-y-2">
            {employees.slice(0, 4).map(emp => (
              <div
                key={emp.id}
                onClick={() => { setSelEmp(emp.id); setPage("employee-profile"); }}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = IVORY)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <Av initials={emp.initials} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: BROWN }}>{emp.name}</div>
                  <div className="text-xs truncate" style={{ color: MUTED }}>{emp.designation}</div>
                </div>
                <Badge status={emp.status} />
              </div>
            ))}
          </div>
          <button
            onClick={() => setPage("employees")}
            className="w-full mt-4 py-2 rounded-lg text-sm border transition-colors"
            style={{ color: MUTED, borderColor: BORDER }}
          >
            View All Employees
          </button>
        </Card>
      </div>

      {/* Pending leaves */}
      {pending.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="font-semibold" style={{ color: BROWN }}>Pending Leave Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: IVORY }}>
                  {["Employee", "Leave Type", "Dates", "Days", "Status", "Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map(l => (
                  <tr key={l.id} className="border-t" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: BROWN }}>{l.employeeName}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{l.leaveType}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{l.startDate} — {l.endDate}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{l.days}</td>
                    <td className="px-4 py-3"><Badge status={l.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { onApprove(l.id); toast.success("Leave request approved."); }} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors">Approve</button>
                        <button onClick={() => { onReject(l.id, "Rejected by HR."); toast.error("Leave request rejected."); }} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── HR Employees ─────────────────────────────────────────────────────────────

function HREmp({ employees, setPage, setSelEmp }: {
  employees: Employee[]; setPage: (p: string) => void; setSelEmp: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const depts = [...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase();
    return (!search || emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q))
      && (!dept || emp.department === dept)
      && (!status || emp.status === status);
  });

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Employees</h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{"Manage your organization's workforce."}</p>
        </div>
        <button
          onClick={() => toast.info("Add Employee — coming soon in full release.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium flex-shrink-0"
          style={{ backgroundColor: M }}
        >
          <Plus size={15} /> Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}
          />
        </div>
        <select
          value={dept}
          onChange={e => setDept(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
          style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}
        >
          <option value="">All Departments</option>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
          style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}
        >
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Employee", "Employee ID", "Department", "Designation", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Av initials={emp.initials} size="sm" />
                      <div>
                        <div className="text-sm font-medium" style={{ color: BROWN }}>{emp.name}</div>
                        <div className="text-xs" style={{ color: MUTED }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{emp.id}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{emp.department}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{emp.designation}</td>
                  <td className="px-4 py-3"><Badge status={emp.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setSelEmp(emp.id); setPage("employee-profile"); }} className="p-1.5 rounded-lg transition-colors" style={{ color: MUTED }} title="View">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => { setSelEmp(emp.id); setPage("employee-profile"); }} className="p-1.5 rounded-lg transition-colors" style={{ color: MUTED }} title="Edit">
                        <Edit2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: MUTED }}>No employees found.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── HR Employee Profile ──────────────────────────────────────────────────────

function HREmpProfile({ empId, employees, leaves, salaries, attendance, onUpdateEmp, onUpdateSalary, onBack }: {
  empId: string; employees: Employee[]; leaves: LeaveRequest[]; salaries: Record<string, Salary>;
  attendance: AttendanceRecord[]; onUpdateEmp: (e: Employee) => void;
  onUpdateSalary: (id: string, s: Salary) => void; onBack: () => void;
}) {
  const emp = employees.find(e => e.id === empId);
  const [editOpen, setEditOpen] = useState(false);
  const [salOpen, setSalOpen] = useState(false);
  const [ed, setEd] = useState<Partial<Employee>>({});
  const [sd, setSd] = useState<Salary>({ basic: 0, hra: 0, allowances: 0, deductions: 0, net: 0 });

  if (!emp) return <div className="p-6" style={{ color: MUTED }}>Employee not found.</div>;

  const empLeaves = leaves.filter(l => l.employeeId === empId);
  const empAtt = attendance.filter(a => a.employeeId === empId);
  const salary = salaries[empId];

  const saveEdit = () => { onUpdateEmp({ ...emp, ...ed }); setEditOpen(false); toast.success("Employee information updated."); };
  const saveSal = () => {
    const net = (sd.basic + sd.hra + sd.allowances) - sd.deductions;
    onUpdateSalary(empId, { ...sd, net });
    setSalOpen(false);
    toast.success("Salary structure updated.");
  };

  return (
    <div className="p-5 md:p-6 space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm transition-colors" style={{ color: MUTED }}>
        <ChevronLeft size={15} /> Back to Employees
      </button>

      <Card className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Av initials={emp.initials} size="xl" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold" style={{ color: BROWN }}>{emp.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: MUTED }}>{emp.designation}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-sm" style={{ color: MUTED }}>{emp.department}</span>
              <span style={{ color: MUTED }}>·</span>
              <span className="text-sm" style={{ color: MUTED }}>{emp.id}</span>
              <Badge status={emp.status} />
            </div>
          </div>
          <button
            onClick={() => { setEd({ ...emp }); setEditOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: M }}
          >
            <Edit2 size={14} /> Edit Employee
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Personal Information</h3>
          <div className="space-y-3">
            {[
              { label: "Full Name", value: emp.name, Icon: User },
              { label: "Email", value: emp.email, Icon: Mail },
              { label: "Phone", value: emp.phone, Icon: Phone },
              { label: "Address", value: emp.address, Icon: MapPin },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: MUTED }} />
                <div>
                  <div className="text-xs" style={{ color: MUTED }}>{label}</div>
                  <div className="text-sm mt-0.5" style={{ color: BROWN }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Job Information</h3>
          <div className="space-y-2.5">
            {[
              { label: "Employee ID", value: emp.id },
              { label: "Department", value: emp.department },
              { label: "Designation", value: emp.designation },
              { label: "Joining Date", value: emp.joiningDate },
              { label: "Employment Type", value: emp.employmentType },
              { label: "Reporting Manager", value: emp.manager },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span style={{ color: MUTED }}>{label}</span>
                <span className="font-medium" style={{ color: BROWN }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: BROWN }}>Attendance Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Present", val: empAtt.filter(a => a.status === "Present").length, cls: "text-green-600" },
              { label: "Absent", val: empAtt.filter(a => a.status === "Absent").length, cls: "text-red-600" },
              { label: "Half-day", val: empAtt.filter(a => a.status === "Half-day").length, cls: "text-amber-600" },
              { label: "On Leave", val: empAtt.filter(a => a.status === "Leave").length, cls: "text-blue-600" },
            ].map(({ label, val, cls }) => (
              <div key={label} className="p-3 rounded-lg" style={{ backgroundColor: IVORY }}>
                <div className={`text-2xl font-bold ${cls}`}>{val}</div>
                <div className="text-xs mt-1" style={{ color: MUTED }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: BROWN }}>Payroll</h3>
            <button onClick={() => { setSd({ ...salary }); setSalOpen(true); }} className="text-sm font-medium" style={{ color: M }}>Edit Salary</button>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Basic", value: salary?.basic, sign: "+" },
              { label: "HRA", value: salary?.hra, sign: "+" },
              { label: "Allowances", value: salary?.allowances, sign: "+" },
              { label: "Deductions", value: salary?.deductions, sign: "-" },
            ].map(({ label, value, sign }) => (
              <div key={label} className="flex justify-between text-sm pb-2 border-b" style={{ borderColor: BORDER }}>
                <span style={{ color: MUTED }}>{label}</span>
                <span className={`font-medium ${sign === "-" ? "text-red-600" : "text-[#2F2420]"}`}>{sign}₹{value?.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold pt-1">
              <span style={{ color: BROWN }}>Net Salary</span>
              <span style={{ color: M }}>₹{salary?.net.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b" style={{ borderColor: BORDER }}>
          <h3 className="font-semibold" style={{ color: BROWN }}>Leave History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Leave Type", "Date Range", "Days", "Reason", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {empLeaves.map(l => (
                <tr key={l.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{l.leaveType}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{l.startDate} — {l.endDate}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{l.days}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{l.reason}</td>
                  <td className="px-4 py-3"><Badge status={l.status} /></td>
                </tr>
              ))}
              {empLeaves.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: MUTED }}>No leave history.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Employee Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Employee">
        <div className="space-y-4">
          <Field label="Full Name" value={ed.name || ""} onChange={v => setEd(d => ({ ...d, name: v }))} />
          <Field label="Email" type="email" value={ed.email || ""} onChange={v => setEd(d => ({ ...d, email: v }))} />
          <Field label="Phone" value={ed.phone || ""} onChange={v => setEd(d => ({ ...d, phone: v }))} />
          <Field label="Department" value={ed.department || ""} onChange={v => setEd(d => ({ ...d, department: v }))} />
          <Field label="Designation" value={ed.designation || ""} onChange={v => setEd(d => ({ ...d, designation: v }))} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: BROWN }}>Address</label>
            <textarea
              value={ed.address || ""}
              onChange={e => setEd(d => ({ ...d, address: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none h-20"
              style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Btn variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Btn>
            <Btn onClick={saveEdit}>Save Changes</Btn>
          </div>
        </div>
      </Modal>

      {/* Edit Salary Modal */}
      <Modal open={salOpen} onClose={() => setSalOpen(false)} title="Edit Salary Structure">
        <div className="space-y-4">
          {(["basic", "hra", "allowances", "deductions"] as const).map(f => (
            <div key={f} className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: BROWN }}>
                {f === "hra" ? "HRA" : f.charAt(0).toUpperCase() + f.slice(1)}
              </label>
              <input
                type="number"
                value={sd[f]}
                onChange={e => setSd(d => ({ ...d, [f]: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
              />
            </div>
          ))}
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: BEIGE, color: MUTED }}>
            Net Salary: <strong style={{ color: BROWN }}>₹{((sd.basic + sd.hra + sd.allowances) - sd.deductions).toLocaleString()}</strong>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Btn variant="secondary" onClick={() => setSalOpen(false)}>Cancel</Btn>
            <Btn onClick={saveSal}>Save Salary</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── HR Attendance ────────────────────────────────────────────────────────────

function HRAtt({ employees, attendance }: { employees: Employee[]; attendance: AttendanceRecord[] }) {
  const [date, setDate] = useState("2026-08-22");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState("");
  const depts = [...new Set(employees.map(e => e.department))];

  const rows = employees.map(emp => {
    const rec = attendance.find(a => a.employeeId === emp.id && a.date === date);
    return { emp, checkIn: rec?.checkIn ?? null, checkOut: rec?.checkOut ?? null, hours: rec?.hours ?? null, status: rec?.status ?? "Absent" };
  });

  const filtered = rows.filter(r =>
    (!search || r.emp.name.toLowerCase().includes(search.toLowerCase()))
    && (!dept || r.emp.department === dept)
    && (!status || r.status === status)
  );

  const counts = { Present: filtered.filter(r => r.status === "Present").length, Absent: filtered.filter(r => r.status === "Absent").length, "Half-day": filtered.filter(r => r.status === "Half-day").length, Leave: filtered.filter(r => r.status === "Leave").length };

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Attendance</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Workforce attendance management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(counts).map(([label, value]) => (
          <Card key={label} className="p-4">
            <div className="text-2xl font-bold" style={{ color: BROWN }}>{value}</div>
            <div className="mt-1.5"><Badge status={label} /></div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}
        />
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employee…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}
          />
        </div>
        <select value={dept} onChange={e => setDept(e.target.value)} className="px-3 py-2.5 rounded-lg text-sm outline-none appearance-none" style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}>
          <option value="">All Departments</option>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} className="px-3 py-2.5 rounded-lg text-sm outline-none appearance-none" style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}>
          <option value="">All Status</option>
          {["Present", "Absent", "Half-day", "Leave"].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Employee", "Department", "Check-in", "Check-out", "Hours", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.emp.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Av initials={r.emp.initials} size="sm" />
                      <span className="text-sm font-medium" style={{ color: BROWN }}>{r.emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{r.emp.department}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{r.checkIn || "—"}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{r.checkOut || "—"}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{r.hours || "—"}</td>
                  <td className="px-4 py-3"><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── HR Leave Requests ────────────────────────────────────────────────────────

function HRLeave({ leaves, onApprove, onReject }: {
  leaves: LeaveRequest[]; onApprove: (id: string) => void; onReject: (id: string, c: string) => void;
}) {
  const [tab, setTab] = useState<"Pending" | "Approved" | "Rejected" | "All">("Pending");
  const [rejectId, setRejectId] = useState("");
  const [comment, setComment] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);

  const pending = leaves.filter(l => l.status === "Pending").length;
  const filtered = tab === "All" ? leaves : leaves.filter(l => l.status === tab);

  const doReject = () => {
    if (!comment.trim()) { toast.error("Please provide a reason for rejection."); return; }
    onReject(rejectId, comment);
    setRejectOpen(false);
    setComment("");
    toast.error("Leave request rejected.");
  };

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Leave Requests</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Review and manage employee leave requests</p>
      </div>

      <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: BEIGE }}>
        {(["Pending", "Approved", "Rejected", "All"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            style={tab === t ? { backgroundColor: CARD, color: BROWN, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" } : { color: MUTED }}
          >
            {t}
            {t === "Pending" && pending > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: M }}>{pending}</span>
            )}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Employee", "Leave Type", "Date Range", "Days", "Reason", "Status", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-t" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap" style={{ color: BROWN }}>{l.employeeName}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{l.leaveType}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: MUTED }}>{l.startDate} — {l.endDate}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>{l.days}</td>
                  <td className="px-4 py-3 text-sm max-w-[130px] truncate" style={{ color: MUTED }}>{l.reason}</td>
                  <td className="px-4 py-3"><Badge status={l.status} /></td>
                  <td className="px-4 py-3">
                    {l.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => { onApprove(l.id); toast.success("Leave request approved."); }} className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200 transition-colors whitespace-nowrap">Approve</button>
                        <button onClick={() => { setRejectId(l.id); setComment(""); setRejectOpen(true); }} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200 transition-colors whitespace-nowrap">Reject</button>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: MUTED }}>{l.comment || "—"}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: MUTED }}>No {tab.toLowerCase()} requests.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Leave Request">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: MUTED }}>Please provide a reason for rejecting this leave request.</p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: BROWN }}>Reason / Comment <span style={{ color: M }}>*</span></label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Enter reason for rejection…"
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none h-24"
              style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Btn variant="secondary" onClick={() => setRejectOpen(false)}>Cancel</Btn>
            <Btn variant="danger" onClick={doReject}>Confirm Reject</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── HR Payroll ───────────────────────────────────────────────────────────────

function HRPayroll({ employees, salaries, onUpdateSalary }: {
  employees: Employee[]; salaries: Record<string, Salary>; onUpdateSalary: (id: string, s: Salary) => void;
}) {
  const [search, setSearch] = useState("");
  const [selId, setSelId] = useState("");
  const [sd, setSd] = useState<Salary>({ basic: 0, hra: 0, allowances: 0, deductions: 0, net: 0 });
  const [salOpen, setSalOpen] = useState(false);

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()));
  const total = employees.reduce((sum, e) => sum + (salaries[e.id]?.net || 0), 0);

  const openEdit = (emp: Employee) => {
    setSelId(emp.id);
    setSd({ ...salaries[emp.id] });
    setSalOpen(true);
  };

  const save = () => {
    const net = (sd.basic + sd.hra + sd.allowances) - sd.deductions;
    onUpdateSalary(selId, { ...sd, net });
    setSalOpen(false);
    toast.success("Salary structure updated.");
  };

  return (
    <div className="p-5 md:p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: BROWN }}>Payroll</h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>Manage employee salary structures</p>
        </div>
        <Card className="p-4 text-right flex-shrink-0">
          <div className="text-xs" style={{ color: MUTED }}>Total Monthly Payroll</div>
          <div className="text-xl font-bold mt-0.5" style={{ color: BROWN }}>₹{total.toLocaleString()}</div>
        </Card>
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search employee…"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{ border: `1px solid ${BORDER}`, backgroundColor: CARD, color: BROWN }}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: IVORY }}>
                {["Employee", "Department", "Basic Salary", "Allowances", "Deductions", "Net Salary", "Action"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => {
                const s = salaries[emp.id];
                return (
                  <tr key={emp.id} className="border-t" style={{ borderColor: BORDER }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Av initials={emp.initials} size="sm" />
                        <div>
                          <div className="text-sm font-medium" style={{ color: BROWN }}>{emp.name}</div>
                          <div className="text-xs" style={{ color: MUTED }}>{emp.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: MUTED }}>{emp.department}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>₹{s?.basic.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: BROWN }}>₹{s?.allowances.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-red-600">-₹{s?.deductions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: M }}>₹{s?.net.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(emp)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
                        style={{ color: MUTED, borderColor: BORDER }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={salOpen} onClose={() => setSalOpen(false)} title="Edit Salary Structure">
        <div className="space-y-4">
          {(["basic", "hra", "allowances", "deductions"] as const).map(f => (
            <div key={f} className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: BROWN }}>
                {f === "hra" ? "HRA" : f.charAt(0).toUpperCase() + f.slice(1)}
              </label>
              <input
                type="number"
                value={sd[f]}
                onChange={e => setSd(d => ({ ...d, [f]: Number(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: `1px solid ${BORDER}`, backgroundColor: "#fff", color: BROWN }}
              />
            </div>
          ))}
          <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: BEIGE, color: MUTED }}>
            Net Salary: <strong style={{ color: BROWN }}>₹{((sd.basic + sd.hra + sd.allowances) - sd.deductions).toLocaleString()}</strong>
          </div>
          <div className="flex justify-end gap-3 pt-1">
            <Btn variant="secondary" onClick={() => setSalOpen(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Salary</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [page, setPage] = useState("dashboard");
  const [selEmpId, setSelEmpId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>(INIT_EMPLOYEES);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INIT_LEAVES);
  const [salaries, setSalaries] = useState<Record<string, Salary>>(INIT_SALARIES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INIT_NOTIFICATIONS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INIT_ATTENDANCE);
  const [checkIns, setCheckIns] = useState<Record<string, CheckInState>>({
    EMP001: { checkedIn: false, checkInTime: null, checkedOut: false, checkOutTime: null },
    EMP002: { checkedIn: true, checkInTime: "8:45 AM", checkedOut: false, checkOutTime: null },
    EMP003: { checkedIn: true, checkInTime: "9:15 AM", checkedOut: false, checkOutTime: null },
    EMP004: { checkedIn: false, checkInTime: null, checkedOut: false, checkOutTime: null },
    EMP005: { checkedIn: true, checkInTime: "8:50 AM", checkedOut: false, checkOutTime: null },
  });

  const handleLogin = (emp: Employee) => { setCurrentUser(emp); setPage("dashboard"); };

  const handleLogout = () => { setCurrentUser(null); setPage("dashboard"); setSidebarOpen(false); };

  const handleCheckIn = () => {
    if (!currentUser) return;
    const t = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckIns(p => ({ ...p, [currentUser.id]: { ...p[currentUser.id], checkedIn: true, checkInTime: t } }));
    setNotifications(p => [{ id: `N${Date.now()}`, employeeId: currentUser.id, message: `You checked in at ${t}.`, read: false, time: "Just now", type: "attendance" }, ...p]);
    toast.success(`You have successfully checked in at ${t}.`);
  };

  const handleCheckOut = () => {
    if (!currentUser) return;
    const t = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setCheckIns(p => ({ ...p, [currentUser.id]: { ...p[currentUser.id], checkedOut: true, checkOutTime: t } }));
    toast.success(`You have successfully checked out at ${t}.`);
  };

  const handleSubmitLeave = (l: Omit<LeaveRequest, "id" | "employeeName" | "submittedOn" | "status">) => {
    const emp = employees.find(e => e.id === l.employeeId);
    const newL: LeaveRequest = { ...l, id: `LR${Date.now()}`, employeeName: emp?.name || "", submittedOn: new Date().toISOString().split("T")[0], status: "Pending" };
    setLeaves(p => [newL, ...p]);
    setNotifications(p => [{ id: `N${Date.now()}`, employeeId: "EMP002", message: `New leave request from ${emp?.name} (${l.startDate} — ${l.endDate}).`, read: false, time: "Just now", type: "leave" }, ...p]);
  };

  const handleApprove = (id: string) => {
    setLeaves(p => p.map(l => l.id === id ? { ...l, status: "Approved" } : l));
    const l = leaves.find(x => x.id === id);
    if (l) setNotifications(p => [{ id: `N${Date.now()}`, employeeId: l.employeeId, message: `Your leave request for ${l.startDate} — ${l.endDate} has been approved.`, read: false, time: "Just now", type: "leave" }, ...p]);
  };

  const handleReject = (id: string, comment: string) => {
    setLeaves(p => p.map(l => l.id === id ? { ...l, status: "Rejected", comment } : l));
    const l = leaves.find(x => x.id === id);
    if (l) setNotifications(p => [{ id: `N${Date.now()}`, employeeId: l.employeeId, message: `Your leave request for ${l.startDate} — ${l.endDate} has been rejected.`, read: false, time: "Just now", type: "leave" }, ...p]);
  };

  const handleUpdateEmp = (emp: Employee) => {
    setEmployees(p => p.map(e => e.id === emp.id ? emp : e));
    if (currentUser?.id === emp.id) setCurrentUser(emp);
  };

  const handleUpdateSalary = (id: string, s: Salary) => {
    setSalaries(p => ({ ...p, [id]: s }));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!currentUser) {
    return (
      <>
        <Toaster richColors position="top-right" />
        <LoginPage onLogin={handleLogin} />
      </>
    );
  }

  const cis = checkIns[currentUser.id] || { checkedIn: false, checkInTime: null, checkedOut: false, checkOutTime: null };
  const myNotifs = notifications.filter(n => n.employeeId === currentUser.id);
  const unread = myNotifs.filter(n => !n.read).length;

  const titles: Record<string, string> = {
    dashboard: "Dashboard", profile: "My Profile", attendance: "Attendance", leave: "Leave",
    payroll: "Payroll", notifications: "Notifications", employees: "Employees",
    "employee-profile": "Employee Profile", "hr-attendance": "Attendance", "leave-requests": "Leave Requests",
  };

  const renderPage = () => {
    if (currentUser.role === "employee") {
      switch (page) {
        case "profile": return <EmpProfile user={currentUser} employees={employees} salaries={salaries} onUpdate={handleUpdateEmp} />;
        case "attendance": return <EmpAttendance user={currentUser} attendance={attendance} cis={cis} />;
        case "leave": return <EmpLeave user={currentUser} leaves={leaves} onSubmit={handleSubmitLeave} />;
        case "payroll": return <EmpPayroll user={currentUser} salaries={salaries} />;
        case "notifications": return <NotifPage user={currentUser} notifications={notifications} onMark={handleMarkRead} />;
        default: return <EmpDashboard user={currentUser} leaves={leaves} cis={cis} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} />;
      }
    } else {
      switch (page) {
        case "employees": return <HREmp employees={employees} setPage={setPage} setSelEmp={setSelEmpId} />;
        case "employee-profile":
          return selEmpId
            ? <HREmpProfile empId={selEmpId} employees={employees} leaves={leaves} salaries={salaries} attendance={attendance} onUpdateEmp={handleUpdateEmp} onUpdateSalary={handleUpdateSalary} onBack={() => setPage("employees")} />
            : <HREmp employees={employees} setPage={setPage} setSelEmp={setSelEmpId} />;
        case "hr-attendance": return <HRAtt employees={employees} attendance={attendance} />;
        case "leave-requests": return <HRLeave leaves={leaves} onApprove={handleApprove} onReject={handleReject} />;
        case "payroll": return <HRPayroll employees={employees} salaries={salaries} onUpdateSalary={handleUpdateSalary} />;
        case "notifications": return <NotifPage user={currentUser} notifications={notifications} onMark={handleMarkRead} />;
        default:
          return <HRDash user={currentUser} employees={employees} leaves={leaves} onApprove={handleApprove} onReject={handleReject} setPage={setPage} setSelEmp={setSelEmpId} />;
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: IVORY }}>
      <Toaster richColors position="top-right" />
      <Sidebar
        role={currentUser.role}
        page={page}
        setPage={setPage}
        user={currentUser}
        onLogout={handleLogout}
        mobileOpen={sidebarOpen}
        closeMobile={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          title={titles[page] || "Dashboard"}
          user={currentUser}
          unread={unread}
          onMenu={() => setSidebarOpen(true)}
          setPage={setPage}
        />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: IVORY }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
