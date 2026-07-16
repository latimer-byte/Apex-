import React, { useState } from "react";
import { 
  Lightbulb, 
  ThumbsUp, 
  Plus, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  EyeOff, 
  User, 
  Search, 
  Sparkles, 
  Filter, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from "lucide-react";

export interface Suggestion {
  id: string;
  title: string;
  content: string;
  category: "Workspace" | "Amenities" | "Events" | "Processes" | "Other";
  office: string;
  date: string;
  isAnonymous: boolean;
  authorName?: string;
  authorTeam?: string;
  likes: number;
  status: "Under Review" | "Planned" | "Implemented" | "Deferred";
  adminResponse?: string;
  adminResponseDate?: string;
  adminResponseBy?: string;
}

// Pre-seeded suggestions across offices to make the app feel alive instantly
export const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: "SUG-001",
    title: "Height-Adjustable Standing Desks on Level 3",
    content: "Currently, standing desks are only available on Level 1. It would be amazing to have at least 4 shared height-adjustable desks on Level 3 so that engineering and tech teams can rotate and work standing up. It helps tremendously with ergonomics and energy levels during long coding sessions.",
    category: "Workspace",
    office: "Cyberjaya, Malaysia (HQ)",
    date: "12 Jul 2026",
    isAnonymous: false,
    authorName: "Lau Wei Ping",
    authorTeam: "Engineering / Technology (core tech, platform, infrastructure)",
    likes: 18,
    status: "Planned",
    adminResponse: "Great feedback! We have approved budget for 10 new height-adjustable desks. 4 of these will be installed in the open-collaboration bay on Level 3 by late August.",
    adminResponseDate: "14 Jul 2026",
    adminResponseBy: "Aisha Kamara (Facilities Director)"
  },
  {
    id: "SUG-002",
    title: "Incorporate Healthy Snack and Beverage Options",
    content: "Could we stock more healthy snack choices in the office micro-kitchens and vending machines? Raw almonds, fresh seasonal fruit baskets, and sugar-free protein bars would be highly appreciated over the current chips, chocolates, and carbonated sodas.",
    category: "Amenities",
    office: "Limassol, Cyprus",
    date: "14 Jul 2026",
    isAnonymous: true,
    likes: 11,
    status: "Under Review",
    adminResponse: "Thank you for this healthy suggestion! We are contacting our local pantry supplier in Cyprus to adjust our automated delivery configuration to replace 40% of the confectioneries with organic almonds, dried fruits, and high-protein alternatives.",
    adminResponseDate: "15 Jul 2026",
    adminResponseBy: "Clara Santos (Office Admin Specialist)"
  },
  {
    id: "SUG-003",
    title: "Weekly Social Board Game Nights",
    content: "Let's organize a weekly or bi-weekly evening where staff can stay back after office hours, play board games, and socialize. The company could fund some popular tabletop games (like Catan, Ticket to Ride, Codenames) or provide simple pizzas. It would be fantastic for cross-team bonding!",
    category: "Events",
    office: "London, UK",
    date: "15 Jul 2026",
    isAnonymous: false,
    authorName: "Emily Robinson",
    authorTeam: "Growth AI & Product",
    likes: 24,
    status: "Implemented",
    adminResponse: "We love this initiative! Board game night is officially set up for Thursday evenings in the Level 2 central lounge. We bought a premium board game bundle and pizzas are on the house for everyone attending. Check your calendar invite!",
    adminResponseDate: "16 Jul 2026",
    adminResponseBy: "David Lim (Office Admin Specialist)"
  },
  {
    id: "SUG-004",
    title: "Streamlined Meeting Room Booking Templates",
    content: "We need a standard agenda template automatically attached when booking rooms via Outlook or Google Calendar. Too many meetings are booked without clear objectives, which reduces overall productivity.",
    category: "Processes",
    office: "Cyberjaya, Malaysia (HQ)",
    date: "11 Jul 2026",
    isAnonymous: false,
    authorName: "Sarah Jenkins",
    authorTeam: "Operations",
    likes: 6,
    status: "Under Review"
  },
  {
    id: "SUG-005",
    title: "Electric Vehicle (EV) Charging Station Installation",
    content: "With more staff transitioning to plug-in hybrids and EVs, it would be extremely helpful to have at least two designated charging bays in the lower basement garage. We could charge during core office hours.",
    category: "Workspace",
    office: "Cyberjaya, Malaysia (HQ)",
    date: "10 Jul 2026",
    isAnonymous: true,
    likes: 14,
    status: "Deferred",
    adminResponse: "We investigated this suggestion in detail. Unfortunately, the basement electrical substations in this building do not have sufficient spare capacity for high-amp EV chargers without a major structural upgrade. We are deferring this until our lease renewal negotiations next year.",
    adminResponseDate: "13 Jul 2026",
    adminResponseBy: "Peter Müller (Facilities Lead)"
  },
  {
    id: "SUG-006",
    title: "Outdoor Work Area with Wi-Fi Coverage",
    content: "The courtyard garden in the Mauritius office is beautiful. If we could expand high-speed Wi-Fi coverage and install some weatherproof power outlets, employees could work outdoors on sunny days.",
    category: "Workspace",
    office: "Mauritius",
    date: "13 Jul 2026",
    isAnonymous: false,
    authorName: "Rayan Govinden",
    authorTeam: "Engineering / Technology (core tech, platform, infrastructure)",
    likes: 9,
    status: "Planned",
    adminResponse: "This sounds wonderful. Our network engineers have mapped out the garden and approved extending the mesh Wi-Fi network. Waterproof power outlets are being installed next week!",
    adminResponseDate: "15 Jul 2026",
    adminResponseBy: "Tom Reyes (Facilities Coordinator)"
  }
];

interface SuggestionBoxProps {
  office: string;
  theme: "light" | "dark";
  suggestions: Suggestion[];
  onAddSuggestion: (s: Suggestion) => void;
  onLikeSuggestion: (id: string) => void;
  onUpdateSuggestionStatus: (id: string, status: Suggestion["status"], response: string, adminBy: string) => void;
  isAdmin: boolean;
  adminName: string;
}

export default function SuggestionBox({
  office,
  theme,
  suggestions,
  onAddSuggestion,
  onLikeSuggestion,
  onUpdateSuggestionStatus,
  isAdmin,
  adminName
}: SuggestionBoxProps) {
  const isDark = theme === "dark";
  
  // Tab control inside suggestion box: "view" or "submit"
  const [activeTab, setActiveTab] = useState<"view" | "submit">("view");
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  // Submit Suggestion Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Suggestion["category"]>("Workspace");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorTeam, setAuthorTeam] = useState("Finance");

  // Admin Response Editor State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adminStatus, setAdminStatus] = useState<Suggestion["status"]>("Under Review");
  const [adminResponse, setAdminResponse] = useState("");

  // Track liked suggestions locally in session storage/state to prevent infinite spam upvoting
  const [likedSuggestions, setLikedSuggestions] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem("liked_suggestions_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleToggleLike = (id: string) => {
    let newLiked: string[];
    if (likedSuggestions.includes(id)) {
      newLiked = likedSuggestions.filter(item => item !== id);
    } else {
      newLiked = [...likedSuggestions, id];
    }
    setLikedSuggestions(newLiked);
    try {
      sessionStorage.setItem("liked_suggestions_list", JSON.stringify(newLiked));
    } catch (e) {}
    
    // Call parent handler to update state count
    onLikeSuggestion(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a suggestion title.");
      return;
    }
    if (!content.trim()) {
      alert("Please provide a description of your suggestion.");
      return;
    }
    if (!isAnonymous && !authorName.trim()) {
      alert("Please provide your name or choose to submit anonymously.");
      return;
    }

    const nextIdNum = Math.floor(100 + Math.random() * 900);
    const newSug: Suggestion = {
      id: `SUG-${nextIdNum}`,
      title: title.trim(),
      content: content.trim(),
      category: category,
      office: office,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      isAnonymous: isAnonymous,
      authorName: isAnonymous ? undefined : authorName.trim(),
      authorTeam: isAnonymous ? undefined : authorTeam,
      likes: 1, // Auto-liked by submitter
      status: "Under Review"
    };

    onAddSuggestion(newSug);
    
    // Add to liked suggestions list locally so they can't double-like their own right away
    const updatedLiked = [...likedSuggestions, newSug.id];
    setLikedSuggestions(updatedLiked);
    try { sessionStorage.setItem("liked_suggestions_list", JSON.stringify(updatedLiked)); } catch {}

    // Reset Form
    setTitle("");
    setContent("");
    setIsAnonymous(false);
    setAuthorName("");
    setActiveTab("view");
  };

  const handleAdminResponseSubmit = (id: string) => {
    onUpdateSuggestionStatus(id, adminStatus, adminResponse.trim(), adminName);
    setEditingId(null);
    setAdminResponse("");
  };

  // Filter suggestions by office & search terms
  const currentOfficeSuggestions = suggestions.filter(s => {
    // Exact match or fallback for matching Malaysia HQ
    const officeMatch = s.office === office || 
      (s.office.includes("Malaysia") && office.includes("Malaysia"));
    return officeMatch;
  });

  const filteredSuggestions = currentOfficeSuggestions.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (s.authorName && s.authorName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort: Highest likes first, then date
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => b.likes - a.likes);

  // Status Badge Helper
  const renderStatusBadge = (status: Suggestion["status"]) => {
    const styles: Record<Suggestion["status"], { bg: string; text: string; dot: string }> = {
      "Under Review": {
        bg: isDark ? "rgba(245, 158, 11, 0.1)" : "#FFFBEB",
        text: "#D97706",
        dot: "#F59E0B"
      },
      "Planned": {
        bg: isDark ? "rgba(59, 130, 246, 0.1)" : "#EBF3FF",
        text: "#1A6CCC",
        dot: "#3B82F6"
      },
      "Implemented": {
        bg: isDark ? "rgba(16, 185, 129, 0.1)" : "#E6FAF3",
        text: "#00C07B",
        dot: "#10B981"
      },
      "Deferred": {
        bg: isDark ? "rgba(148, 163, 184, 0.1)" : "#F1F5F9",
        text: isDark ? "#94A3B8" : "#64748B",
        dot: "#94A3B8"
      }
    };

    const s = styles[status] || styles["Under Review"];

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.text }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
        {status}
      </span>
    );
  };

  // Category Icon Helper
  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case "Workspace": return "🛋️";
      case "Amenities": return "☕";
      case "Events": return "🎉";
      case "Processes": return "📋";
      default: return "💡";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ animation: "slideup 0.4s ease-out" }}>
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF444F] mb-1">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Empowering the Workplace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>
            General Suggestion Box
          </h1>
          <p className="text-sm mt-1" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
            Have ideas to make the <span className="font-semibold text-[#FF444F]">{office.split(",")[0]}</span> office a better place? Share and upvote suggestions below!
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab("view"); setEditingId(null); }}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "view"
                ? "bg-[#FF444F] text-white shadow-md shadow-[#FF444F]30"
                : isDark ? "bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] border border-[#334155]" : "bg-white hover:bg-gray-100 text-[#515A70] border border-[#E4E7ED]"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Browse Suggestions
          </button>
          {!isAdmin && (
            <button
              onClick={() => setActiveTab("submit")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "submit"
                  ? "bg-[#FF444F] text-white shadow-md shadow-[#FF444F]30"
                  : isDark ? "bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] border border-[#334155]" : "bg-white hover:bg-gray-100 text-[#515A70] border border-[#E4E7ED]"
              }`}
            >
              <Plus className="w-4 h-4" />
              Make Suggestion
            </button>
          )}
        </div>
      </div>

      {activeTab === "submit" ? (
        /* ─── STAFF SUGGESTION SUBMISSION FORM ─── */
        <div className="p-6 sm:p-8 rounded-2xl border" style={{ backgroundColor: isDark ? "#1E293B" : "#FFFFFF", borderColor: isDark ? "#334155" : "#E4E7ED" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#FF444F]15 border border-[#FF444F]30 flex items-center justify-center text-lg">💡</div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>Submit a New Suggestion</h2>
              <p className="text-xs" style={{ color: isDark ? "#94A3B8" : "#7C8BA1" }}>Your constructive ideas are reviewed directly by the Office Operations team.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
                Suggestion Category <span className="text-[#FF444F]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(["Workspace", "Amenities", "Events", "Processes", "Other"] as Suggestion["category"][]).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      category === cat
                        ? "border-[#FF444F] bg-[#FF444F]08 text-[#FF444F] font-bold"
                        : isDark ? "border-[#334155] bg-[#0F172A] text-[#94A3B8] hover:border-[#475569]" : "border-[#E2E8F0] bg-white text-[#515A70] hover:border-[#CBD5E1]"
                    }`}
                  >
                    <span className="mr-1">{getCategoryEmoji(cat)}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
                Title / Brief Headline <span className="text-[#FF444F]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Free coffee barista bar in central lobby"
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all focus:border-[#FF444F]"
                style={{ 
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF", 
                  borderColor: isDark ? "#334155" : "#E2E8F0",
                  color: isDark ? "#F8FAFC" : "#181C25"
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
                Detailed Suggestion & Business Case <span className="text-[#FF444F]">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Explain your idea clearly. Why is it beneficial? What problem does it solve, and how will it improve life at the office?"
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all focus:border-[#FF444F] resize-y"
                style={{ 
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF", 
                  borderColor: isDark ? "#334155" : "#E2E8F0",
                  color: isDark ? "#F8FAFC" : "#181C25",
                  lineHeight: 1.6
                }}
              />
            </div>

            <div className="p-4 rounded-xl border border-dashed" style={{ backgroundColor: isDark ? "#0F172A" : "#FAFAFA", borderColor: isDark ? "#334155" : "#E2E8F0" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-sm">🕵️</div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>Submit Anonymously</h3>
                    <p className="text-xs" style={{ color: isDark ? "#94A3B8" : "#7C8BA1" }}>Check this box if you wish to withhold your identity from the public board.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 accent-[#FF444F] rounded cursor-pointer"
                />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: isDark ? "#334155" : "#EFF1F5" }}>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
                      Your Full Name <span className="text-[#FF444F]">*</span>
                    </label>
                    <input
                      type="text"
                      required={!isAnonymous}
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      placeholder="e.g. Rachel Adams"
                      className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                      style={{ 
                        backgroundColor: isDark ? "#1E293B" : "#FFFFFF", 
                        borderColor: isDark ? "#334155" : "#E2E8F0",
                        color: isDark ? "#F8FAFC" : "#181C25"
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
                      Your Team / Department <span className="text-[#FF444F]">*</span>
                    </label>
                    <select
                      value={authorTeam}
                      onChange={e => setAuthorTeam(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border outline-none text-sm"
                      style={{ 
                        backgroundColor: isDark ? "#1E293B" : "#FFFFFF", 
                        borderColor: isDark ? "#334155" : "#E2E8F0",
                        color: isDark ? "#F8FAFC" : "#181C25"
                      }}
                    >
                      {["Finance", "Compliance", "Engineering / Technology (core tech, platform, infrastructure)", "Data Analytics", "Security & DR", "HR (Human Resources)", "Growth AI & Product", "Global Partnerships", "CX (Customer Experience / Support)", "Operations"].map(team => (
                        <option key={team} value={team} style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: isDark ? "#F8FAFC" : "#181C25" }}>{team}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("view")}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                style={{ 
                  color: isDark ? "#94A3B8" : "#515A70",
                  borderColor: isDark ? "#334155" : "#E4E7ED",
                  background: "transparent"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold rounded-xl bg-[#FF444F] text-white hover:bg-[#D93540] transition shadow-md shadow-[#FF444F]20 cursor-pointer"
              >
                Submit Suggestion
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ─── SUGGESTIONS BROWSER BOARD ─── */
        <div className="space-y-6">
          {/* Filtering bar */}
          <div className="p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center justify-between" style={{ backgroundColor: isDark ? "#1E293B" : "#FFFFFF", borderColor: isDark ? "#334155" : "#E4E7ED" }}>
            {/* Search */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border outline-none"
                style={{ 
                  backgroundColor: isDark ? "#0F172A" : "#FFFFFF", 
                  borderColor: isDark ? "#334155" : "#E2E8F0",
                  color: isDark ? "#F8FAFC" : "#181C25"
                }}
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Cat:</span>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                  style={{ 
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF", 
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    color: isDark ? "#F8FAFC" : "#181C25"
                  }}
                >
                  <option value="All">All Categories</option>
                  <option value="Workspace">🛋️ Workspace</option>
                  <option value="Amenities">☕ Amenities</option>
                  <option value="Events">🎉 Events</option>
                  <option value="Processes">📋 Processes</option>
                  <option value="Other">💡 Other</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                  style={{ 
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF", 
                    borderColor: isDark ? "#334155" : "#E2E8F0",
                    color: isDark ? "#F8FAFC" : "#181C25"
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Under Review">🟡 Under Review</option>
                  <option value="Planned">🔵 Planned</option>
                  <option value="Implemented">🟢 Implemented</option>
                  <option value="Deferred">⚫ Deferred</option>
                </select>
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="space-y-4">
            {sortedSuggestions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed" style={{ backgroundColor: isDark ? "#1E293B" : "#FFFFFF", borderColor: isDark ? "#334155" : "#E2E8F0" }}>
                <div className="text-4xl mb-3">🎐</div>
                <h3 className="text-base font-bold" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>No suggestions found</h3>
                <p className="text-xs mt-1" style={{ color: isDark ? "#94A3B8" : "#7C8BA1" }}>Be the first to share an idea for the {office.split(",")[0]} office!</p>
              </div>
            ) : (
              sortedSuggestions.map(s => {
                const isLiked = likedSuggestions.includes(s.id);
                const isEditing = editingId === s.id;

                return (
                  <div 
                    key={s.id} 
                    className="p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative group overflow-hidden"
                    style={{ 
                      backgroundColor: isDark ? "#1E293B" : "#FFFFFF", 
                      borderColor: isDark ? "#334155" : "#E4E7ED",
                      boxShadow: isDark ? "none" : "0 4px 16px rgba(0,0,0,0.02)"
                    }}
                  >
                    {/* Corner category tag */}
                    <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1" style={{ backgroundColor: isDark ? "#0F172A" : "#F1F5F9", color: isDark ? "#F8FAFC" : "#181C25" }}>
                          <span>{getCategoryEmoji(s.category)}</span>
                          {s.category}
                        </span>
                        <span className="text-[11px]" style={{ color: isDark ? "#64748B" : "#9AA0B4" }}>
                          ID: {s.id}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(s.status)}
                        <span className="text-xs flex items-center gap-1" style={{ color: isDark ? "#64748B" : "#9AA0B4" }}>
                          <Calendar className="w-3.5 h-3.5" />
                          {s.date}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base sm:text-lg font-bold mb-2 tracking-tight group-hover:text-[#FF444F] transition-colors" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>
                      {s.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm mb-4 leading-relaxed whitespace-pre-line" style={{ color: isDark ? "#94A3B8" : "#515A70" }}>
                      {s.content}
                    </p>

                    {/* Footer Row: Author & Upvote Counter */}
                    <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-3" style={{ borderColor: isDark ? "#334155" : "#EFF1F5" }}>
                      <div className="flex items-center gap-2">
                        {s.isAnonymous ? (
                          <>
                            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs">🕵️</div>
                            <div>
                              <div className="text-xs font-semibold flex items-center gap-1" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>
                                <EyeOff className="w-3 h-3 text-gray-400" /> Anonymous Staff Member
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-7 h-7 rounded-full bg-[#FF444F]15 text-[#FF444F] flex items-center justify-center font-extrabold text-[10px] border border-[#FF444F]30">
                              {s.authorName ? s.authorName.split(" ").map(w => w[0]).join("").slice(0, 2) : "S"}
                            </div>
                            <div>
                              <div className="text-xs font-semibold" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>
                                {s.authorName}
                              </div>
                              <div className="text-[10px]" style={{ color: isDark ? "#64748B" : "#9AA0B4" }}>
                                {s.authorTeam}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Right side interaction buttons */}
                      <div className="flex items-center gap-2">
                        {/* Likes upvote */}
                        <button
                          onClick={() => handleToggleLike(s.id)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isLiked
                              ? "bg-[#FF444F] border-[#FF444F] text-white"
                              : isDark 
                                ? "bg-[#0F172A] border-[#334155] text-[#94A3B8] hover:border-[#FF444F] hover:text-[#FF444F]" 
                                : "bg-white border-[#E2E8F0] text-[#515A70] hover:border-[#FF444F] hover:text-[#FF444F] shadow-sm"
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
                          <span>{s.likes} {s.likes === 1 ? "Upvote" : "Upvotes"}</span>
                        </button>

                        {/* Admin Action Button */}
                        {isAdmin && !isEditing && (
                          <button
                            onClick={() => {
                              setEditingId(s.id);
                              setAdminStatus(s.status);
                              setAdminResponse(s.adminResponse || "");
                            }}
                            className="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all bg-[#FF444F]15 border-[#FF444F]30 text-[#FF444F] hover:bg-[#FF444F] hover:text-white cursor-pointer"
                          >
                            ✍️ Respond
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Admin Response Speach Bubble */}
                    {s.adminResponse && !isEditing && (
                      <div className="mt-4 p-4 rounded-xl border border-dashed text-xs leading-relaxed" style={{ backgroundColor: isDark ? "#101F30" : "#FFFBF5", borderColor: isDark ? "#1E3B5C" : "#FCD34D" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 font-bold text-[#FF444F]">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Official Operations Response
                          </div>
                          <span style={{ color: isDark ? "#64748B" : "#9AA0B4" }}>
                            {s.adminResponseDate}
                          </span>
                        </div>
                        <p style={{ color: isDark ? "#94A3B8" : "#515A70" }} className="italic">
                          "{s.adminResponse}"
                        </p>
                        <div className="mt-2 text-[10px] text-right font-semibold" style={{ color: isDark ? "#64748B" : "#7C8BA1" }}>
                          — Updated by {s.adminResponseBy}
                        </div>
                      </div>
                    )}

                    {/* Inline Admin Response Editor */}
                    {isAdmin && isEditing && (
                      <div className="mt-4 p-4 rounded-xl border space-y-3" style={{ backgroundColor: isDark ? "#0F172A" : "#F8FAFC", borderColor: isDark ? "#334155" : "#E2E8F0" }}>
                        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: isDark ? "#F8FAFC" : "#181C25" }}>
                          <span>✏️ Operations Suggestion Review Panel</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-1">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Set Decision Status:</label>
                            <select
                              value={adminStatus}
                              onChange={e => setAdminStatus(e.target.value as Suggestion["status"])}
                              className="w-full p-2 text-xs rounded-lg border outline-none"
                              style={{ 
                                backgroundColor: isDark ? "#1E293B" : "#FFFFFF", 
                                borderColor: isDark ? "#334155" : "#E2E8F0",
                                color: isDark ? "#F8FAFC" : "#181C25"
                              }}
                            >
                              <option value="Under Review">🟡 Under Review</option>
                              <option value="Planned">🔵 Planned</option>
                              <option value="Implemented">🟢 Implemented</option>
                              <option value="Deferred">⚫ Deferred</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Response Note / Clarification:</label>
                            <input
                              type="text"
                              value={adminResponse}
                              onChange={e => setAdminResponse(e.target.value)}
                              placeholder="e.g. Approved! We have ordered standing desks..."
                              className="w-full p-2 text-xs rounded-lg border outline-none"
                              style={{ 
                                backgroundColor: isDark ? "#1E293B" : "#FFFFFF", 
                                borderColor: isDark ? "#334155" : "#E2E8F0",
                                color: isDark ? "#F8FAFC" : "#181C25"
                              }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-[11px] font-semibold rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
                            style={{ 
                              color: isDark ? "#94A3B8" : "#515A70",
                              borderColor: isDark ? "#334155" : "#E4E7ED",
                              background: "transparent"
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdminResponseSubmit(s.id)}
                            className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-[#FF444F] text-white hover:bg-[#D93540] transition cursor-pointer"
                          >
                            Publish Response
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
