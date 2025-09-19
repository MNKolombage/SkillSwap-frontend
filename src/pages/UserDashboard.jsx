import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UserDashboard/Navbar";
import SideBar from "../components/SideBar";
import { Users } from "lucide-react";
import axios from "axios";

/**
 * Helper: debounce a function (no extra deps)
 */
function useDebouncedValue(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Lightweight modal (no portal to keep it zero-dep)
 */
function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && <div className="border-t px-6 py-3">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * Tag chip
 */
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
      {children}
    </span>
  );
}

/**
 * Single user card
 */
function UserCard({ user, onConnect, busy }) {
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  
  return (
  <div className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-md ring-1 ring-gray-100 transition-transform hover:scale-[1.025] hover:shadow-lg">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl">
        {user.avatarUrl ? (
          <img
            className="h-16 w-16 rounded-full object-cover"
            src={user.avatarUrl}
            alt={fullName}
          />
        ) : (
          "👤"
        )}
      </div>
      <h3 className="mb-1 line-clamp-1 font-semibold">{fullName}</h3>
      {user.location && (
        <p className="mb-2 text-xs text-gray-500">{user.location}</p>
      )}

      <div className="mb-2 w-full">
        <p className="mb-1 text-xs font-medium text-gray-700">Offers</p>
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered?.length ? (
            user.skillsOffered.slice(0, 5).map((s, i) => <Chip key={i}>{s}</Chip>)
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      </div>

      <div className="mb-4 w-full">
        <p className="mb-1 text-xs font-medium text-gray-700">Wants</p>
        <div className="flex flex-wrap gap-1">
          {user.skillsWanted?.length ? (
            user.skillsWanted.slice(0, 5).map((s, i) => <Chip key={i}>{s}</Chip>)
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onConnect(user)}
        disabled={busy}
        className={`w-full rounded-xl bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {busy ? "Sending..." : "Connect"}
      </button>
    </div>
  );
}

/**
 * Skeleton loader grid
 */
function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
        >
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200" />
          <div className="mx-auto mb-2 h-4 w-32 rounded bg-gray-200" />
          <div className="mx-auto mb-4 h-3 w-20 rounded bg-gray-200" />
          <div className="mb-2 h-3 w-full rounded bg-gray-200" />
          <div className="mb-2 h-3 w-5/6 rounded bg-gray-200" />
          <div className="mb-4 h-3 w-4/6 rounded bg-gray-200" />
          <div className="h-9 w-full rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();

  // ---- Query state
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 500);

  const [offered, setOffered] = useState([]);
  const [wanted, setWanted] = useState([]);
  const [role, setRole] = useState("Any"); // Learner | Mentor | Both | Any
  const [location, setLocation] = useState("");

  // ---- Data state
  const [users, setUsers] = useState([]);
  const [skillsOptions, setSkillsOptions] = useState([]); // for selects (optional)

  // ---- UX state
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ---- Connect Modal state
  const [connectOpen, setConnectOpen] = useState(false);
  const [connectUser, setConnectUser] = useState(null);
  const [connectMessage, setConnectMessage] = useState("");
  const [connectBusy, setConnectBusy] = useState(false);

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    withCredentials: true, // as we use httpOnly cookie for JWT
  });

  // Fetch skills 
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get("/skills"); 
        if (mounted && Array.isArray(res.data)) setSkillsOptions(res.data);
      } catch {
        // silently ignore if not implemented yet
      }
    })();
    return () => (mounted = false);
  }, []);

  // Compose query params
  const currentUser = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user;
    } catch {
      return null;
    }
  }, []);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (role !== "Any") params.set("role", role);
    if (location) params.set("location", location);
    if (offered.length) params.set("offered", offered.join(","));
    if (wanted.length) params.set("wanted", wanted.join(","));
    params.set("page", page.toString());
    
    // Always exclude the current user
    if (currentUser?._id) {
      params.set("exclude", currentUser._id);
    }
    // Enable cookie-based exclusion as backup
    params.set("excludeSelf", "1");
    
    return params.toString();
  }, [q, role, location, offered, wanted, page, currentUser?._id]);


  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await API.get(`/users?${queryParams}`);
      // Expected response shape:
      // { data: User[], page: number, totalPages: number }
      const payload = Array.isArray(res.data)
        ? { data: res.data, page: 1, totalPages: 1 } // backwards compatibility with /auth/users
        : res.data;

      setUsers(payload.data || []);
      const totalPages = payload.totalPages ?? 1;
      setHasMore((payload.page ?? 1) < totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMsg(
        err?.response?.data?.message || "Failed to load users. Please try again."
      );
      setUsers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [API, queryParams]);

  // Run on query change
  useEffect(() => {
    fetchUsers();
    // Reset to page 1 whenever filters/search change (except page itself)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  // Pagination: next page
  const loadMore = async () => {
    // if your backend returns pagination, uncomment and implement incremental fetch
    // setPage((p) => p + 1);
    // For now, button hides if hasMore=false; above fetch already respects page.
    setPage((p) => p + 1);
  };

  // Actions
  const handleMyChats = () => navigate("/my-chats");

  const openConnect = (user) => {
    setConnectUser(user);
    setConnectMessage(
      `Hi ${user.firstName || ""}! I can help with ${
        user.skillsWanted?.[0] ?? "your goals"
      } and would love to learn ${user.skillsOffered?.[0] ?? "from you"}.`
    );
    setConnectOpen(true);
  };

  const sendConnect = async () => {
    if (!connectUser) return;
    try {
      setConnectBusy(true);
      await API.post("/swaps", {
        toUserId: connectUser._id,
        message: connectMessage.trim(),
      });
      setConnectBusy(false);
      setConnectOpen(false);
    } catch (err) {
      setConnectBusy(false);
      alert(
        err?.response?.data?.message ||
          "Couldn't send the request right now. Please try again."
      );
    }
  };

  // Add/remove chips for multiselects
  const addChip = (setter, arr, value) => {
    const v = value.trim();
    if (!v) return;
    if (!arr.includes(v)) setter([...arr, v]);
  };
  const removeChip = (setter, arr, value) => {
    setter(arr.filter((s) => s !== value));
  };

  // Simple input local state for adding skills
  const [offeredInput, setOfferedInput] = useState("");
  const [wantedInput, setWantedInput] = useState("");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <SideBar />
      <div className="mx-auto pt-24 max-w-7xl px-6 md:ml-64">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Users className="text-indigo-400" size={28} />
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleMyChats}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-white shadow-md transition hover:bg-emerald-700"
            >
              My Chats
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Search */}
            <div className="md:col-span-4">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Search (name or skill)
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g., React, Python, Figma…"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Any</option>
                <option>Learner</option>
                <option>Mentor</option>
                <option>Both</option>
              </select>
            </div>

            {/* Location */}
            <div className="md:col-span-3">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or country"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Spacer */}
            <div className="md:col-span-3 flex items-end justify-end gap-2">
              <button
                onClick={() => {
                  setQ("");
                  setRole("Any");
                  setLocation("");
                  setOffered([]);
                  setWanted([]);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => fetchUsers()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Offered / Wanted multi-selects */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Offered */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Skills Offered
              </label>

              {/* chips */}
              <div className="mb-2 flex flex-wrap gap-2">
                {offered.map((s) => (
                  <button
                    key={s}
                    onClick={() => removeChip(setOffered, offered, s)}
                    className="group inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-100"
                  >
                    {s} <span className="text-indigo-400 group-hover:text-indigo-700">×</span>
                  </button>
                ))}
                {!offered.length && (
                  <span className="text-xs text-gray-400">No filters</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={offeredInput}
                  onChange={(e) => setOfferedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addChip(setOffered, offered, offeredInput);
                      setOfferedInput("");
                    }
                  }}
                  placeholder="Add a skill and press Enter"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  list="skills-list"
                />
                <button
                  onClick={() => {
                    addChip(setOffered, offered, offeredInput);
                    setOfferedInput("");
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Wanted */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Skills Wanted
              </label>

              {/* chips */}
              <div className="mb-2 flex flex-wrap gap-2">
                {wanted.map((s) => (
                  <button
                    key={s}
                    onClick={() => removeChip(setWanted, wanted, s)}
                    className="group inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 hover:bg-rose-100"
                  >
                    {s} <span className="text-rose-400 group-hover:text-rose-700">×</span>
                  </button>
                ))}
                {!wanted.length && (
                  <span className="text-xs text-gray-400">No filters</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={wantedInput}
                  onChange={(e) => setWantedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addChip(setWanted, wanted, wantedInput);
                      setWantedInput("");
                    }
                  }}
                  placeholder="Add a skill and press Enter"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  list="skills-list"
                />
                <button
                  onClick={() => {
                    addChip(setWanted, wanted, wantedInput);
                    setWantedInput("");
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* datalist for suggestions if /skills loaded */}
          <datalist id="skills-list">
            {skillsOptions.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
            {errorMsg}
          </div>
        )}

        {/* Users Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : users.length ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  busy={connectBusy && connectUser?._id === user._id}
                  onConnect={openConnect}
                />
              ))}
            </div>

            {/* Pagination */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm shadow-sm hover:bg-gray-50"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="mt-12 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center">
              <Users className="text-indigo-300" size={28} />
            </div>
            <p className="font-medium">No users match your filters (yet)</p>
            <p className="text-sm text-gray-500">
              Try clearing some filters or broadening your search.
            </p>
          </div>
        )}
      </div>

      {/* Connect modal */}
      <Modal
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        title={connectUser ? `Request Swap with ${connectUser.firstName} ${connectUser.lastName}` : "Request Swap"}
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConnectOpen(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={sendConnect}
              disabled={connectBusy}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {connectBusy ? "Sending..." : "Send Request"}
            </button>
          </div>
        }
      >
        <p className="mb-3 text-sm text-gray-600">
          Add a short note to introduce yourself and what you’d like to swap.
        </p>
        <textarea
          rows={4}
          value={connectMessage}
          onChange={(e) => setConnectMessage(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </Modal>
    </div>
  );
}
