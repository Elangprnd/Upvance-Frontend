"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Users, Calendar, Bookmark, Clock, Plus,
  CheckCircle2, XCircle, LogOut, AlertCircle, Loader2, ShieldCheck,
  Trash2, Eye, EyeOff, X
} from "lucide-react";

interface AdminStats {
  totalEvents: number;
  totalUsers: number;
  pendingEvents: number;
  totalBookmarks: number;
}

interface EventRow {
  id: string;
  title: string;
  category: string;
  is_published: boolean;
  is_verified: boolean;
  is_free: boolean;
  price: number;
  start_date: string | null;
  deadline: string | null;
  location: string | null;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Lomba: "bg-blue-100 text-blue-700", Seminar: "bg-purple-100 text-purple-700",
  Workshop: "bg-orange-100 text-orange-700", Beasiswa: "bg-green-100 text-green-700",
  Magang: "bg-teal-100 text-teal-700", Webinar: "bg-indigo-100 text-indigo-700",
  Volunteer: "bg-lime-100 text-lime-700", Greenvity: "bg-emerald-100 text-emerald-700",
  Lainnya: "bg-gray-100 text-gray-600",
};

const ALL_CATEGORIES = ["Lomba","Seminar","Workshop","Beasiswa","Magang","Webinar","Volunteer","Greenvity","Lainnya"];

const EMPTY_FORM = {
  title: "", category: "Lomba", location: "", is_online: false,
  is_free: true, price: 0, start_date: "", deadline: "",
  event_url: "", description: "", image_url: "",
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "events">("overview");

  // Add event modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login?next=/admin"); return; }
      setAdminEmail(user.email ?? "");

      const [statsRes, eventsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/events"),
      ]);

      if (statsRes.status === 403 || eventsRes.status === 403) { router.replace("/dashboard"); return; }

      if (statsRes.ok) { const j = await statsRes.json(); setStats(j.stats); }
      if (eventsRes.ok) { const j = await eventsRes.json(); setEvents(j.data ?? []); }
      setIsLoading(false);
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dashboard");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(ev => ev.filter(e => e.id !== id));
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || "Gagal menghapus event");
      }
    } catch { alert("Gagal terhubung"); }
    setDeletingId(null);
  };

  const handleTogglePublish = async (event: EventRow) => {
    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !event.is_published }),
      });
      if (res.ok) {
        setEvents(ev => ev.map(e => e.id === event.id ? { ...e, is_published: !e.is_published } : e));
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || "Gagal memperbarui event");
      }
    } catch { alert("Gagal terhubung"); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim()) { setAddError("Judul wajib diisi"); return; }
    setIsAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...addForm, price: addForm.is_free ? 0 : addForm.price }),
      });
      const json = await res.json();
      if (!res.ok) { setAddError(json.error || "Gagal menambah event"); return; }
      // Refresh list
      const listRes = await fetch("/api/admin/events");
      if (listRes.ok) { const j = await listRes.json(); setEvents(j.data ?? []); }
      setShowAddModal(false);
      setAddForm(EMPTY_FORM);
    } catch { setAddError("Gagal terhubung ke server"); }
    setIsAdding(false);
  };

  const setF = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setAddForm(f => ({ ...f, [field]: e.target.value }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          <p className="text-gray-400 text-sm">Memuat admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <p className="text-white font-bold text-lg">{error}</p>
          <Link href="/dashboard" className="text-blue-400 hover:underline text-sm">Kembali</Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Event Aktif",   value: stats?.totalEvents   ?? 0, icon: Calendar, color: "from-blue-600 to-blue-700"   },
    { label: "Total Pengguna",      value: stats?.totalUsers    ?? 0, icon: Users,    color: "from-purple-600 to-purple-700"},
    { label: "Event Pending",       value: stats?.pendingEvents ?? 0, icon: Clock,    color: "from-orange-500 to-orange-600"},
    { label: "Total Bookmark",      value: stats?.totalBookmarks?? 0, icon: Bookmark, color: "from-green-600 to-green-700"  },
  ];

  return (
    <div className="min-h-screen bg-gray-950 font-['Inter',sans-serif]">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-[16px]">Upvance Admin</h1>
            <p className="text-gray-400 text-[11px]">{adminEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-[13px] flex items-center gap-1 transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Lihat Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-[13px] font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-[1200px] mx-auto">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 mb-6 bg-gray-900 rounded-xl p-1 w-fit border border-gray-800">
          {(["overview", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === tab ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "overview" ? "Ringkasan" : "Kelola Event"}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <>
            <div className="mb-6">
              <h2 className="text-white text-[22px] font-bold">Dashboard Admin</h2>
              <p className="text-gray-400 text-[14px] mt-1">Ringkasan platform Upvance</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => (
                <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-[16px] p-5 flex flex-col gap-3`}>
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-[12px] font-medium">{card.label}</p>
                    <p className="text-white text-[28px] font-bold leading-tight">{card.value.toLocaleString("id-ID")}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── EVENTS TAB ─── */}
        {activeTab === "events" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white text-[22px] font-bold">Kelola Event</h2>
                <p className="text-gray-400 text-[14px]">{events.length} event terdaftar</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Event
              </button>
            </div>

            <div className="bg-gray-900 rounded-[16px] border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th className="text-left text-gray-400 text-[11px] font-semibold uppercase px-5 py-3">Judul</th>
                      <th className="text-left text-gray-400 text-[11px] font-semibold uppercase px-4 py-3">Kategori</th>
                      <th className="text-left text-gray-400 text-[11px] font-semibold uppercase px-4 py-3">Status</th>
                      <th className="text-left text-gray-400 text-[11px] font-semibold uppercase px-4 py-3">Tanggal</th>
                      <th className="text-left text-gray-400 text-[11px] font-semibold uppercase px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.length === 0 ? (
                      <tr><td colSpan={5} className="text-center text-gray-500 py-8 text-[13px]">Belum ada event</td></tr>
                    ) : events.map((event) => (
                      <tr key={event.id} className="border-t border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <Link href={`/events/${event.id}`} target="_blank" className="text-white text-[13px] font-medium hover:text-blue-400 transition-colors line-clamp-1 max-w-[240px] block">
                            {event.title}
                          </Link>
                          {event.location && <p className="text-gray-500 text-[11px] mt-0.5">{event.location}</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${CATEGORY_COLORS[event.category] ?? "bg-gray-100 text-gray-600"}`}>
                            {event.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className={`flex items-center gap-1 text-[12px] font-medium ${event.is_published ? "text-green-400" : "text-orange-400"}`}>
                              {event.is_published ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                              {event.is_published ? "Published" : "Pending"}
                            </span>
                            {event.is_verified && <span className="text-blue-400 text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-gray-400 text-[12px]">
                          {event.deadline ? new Date(event.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePublish(event)}
                              title={event.is_published ? "Set Pending" : "Publish"}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                            >
                              {event.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              disabled={deletingId === event.id}
                              title="Hapus event"
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                            >
                              {deletingId === event.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* ─── ADD EVENT MODAL ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-900 rounded-[20px] border border-gray-700 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-bold text-[18px]">Tambah Event Baru</h3>
              <button onClick={() => { setShowAddModal(false); setAddError(""); setAddForm(EMPTY_FORM); }} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="px-6 py-5 flex flex-col gap-4">
              {addError && <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-[13px]">{addError}</div>}

              <Field dark label="Judul Event *">
                <input type="text" value={addForm.title} onChange={setF("title")} placeholder="Nama event" required className={darkInput} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field dark label="Kategori *">
                  <select value={addForm.category} onChange={setF("category")} className={darkInput}>
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field dark label="Lokasi">
                  <input type="text" value={addForm.location} onChange={setF("location")} placeholder="Kota atau Online" className={darkInput} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field dark label="Tanggal Mulai">
                  <input type="date" value={addForm.start_date} onChange={setF("start_date")} className={darkInput} />
                </Field>
                <Field dark label="Deadline Daftar">
                  <input type="date" value={addForm.deadline} onChange={setF("deadline")} className={darkInput} />
                </Field>
              </div>
              <Field dark label="Link Pendaftaran">
                <input type="url" value={addForm.event_url} onChange={setF("event_url")} placeholder="https://..." className={darkInput} />
              </Field>
              <Field dark label="Link Gambar (URL)">
                <input type="url" value={addForm.image_url} onChange={setF("image_url")} placeholder="https://..." className={darkInput} />
              </Field>
              <Field dark label="Deskripsi">
                <textarea value={addForm.description} onChange={setF("description")} placeholder="Deskripsi singkat event..." rows={3} className={`${darkInput} resize-none h-auto py-2.5`} />
              </Field>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-gray-300 text-[13px]">
                  <input type="checkbox" checked={addForm.is_free} onChange={e => setAddForm(f => ({ ...f, is_free: e.target.checked, price: e.target.checked ? 0 : f.price }))} className="w-4 h-4" />
                  Gratis
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-gray-300 text-[13px]">
                  <input type="checkbox" checked={addForm.is_online} onChange={e => setAddForm(f => ({ ...f, is_online: e.target.checked }))} className="w-4 h-4" />
                  Online
                </label>
              </div>
              {!addForm.is_free && (
                <Field dark label="Harga (Rp)">
                  <input type="number" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))} min={0} className={darkInput} />
                </Field>
              )}

              <button type="submit" disabled={isAdding} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-2 disabled:opacity-60 flex items-center justify-center gap-2">
                {isAdding ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Plus className="w-4 h-4" /> Tambah Event</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const darkInput = "w-full h-[40px] px-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-[13px] focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500";

function Field({ label, children, dark }: { label: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={`text-[12px] font-semibold ${dark ? "text-gray-400" : "text-gray-600"}`}>{label}</label>
      {children}
    </div>
  );
}
