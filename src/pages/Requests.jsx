import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/UserDashboard/Navbar";
import SideBar from "../components/SideBar";

// Helper to get and set confirmed connections in localStorage
function getConnections() {
  try {
    return JSON.parse(localStorage.getItem("connections")) || [];
  } catch {
    return [];
  }
}
function setConnections(conns) {
  localStorage.setItem("connections", JSON.stringify(conns));
}

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState("");
  const navigate = useNavigate();

  const fetchRequests = () => {
    setLoading(true);
    axios.get("/api/swaps/received", { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch((err) => {
        console.error("Failed to fetch requests:", err);
        setRequests([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setActionBusy(id + action);
    try {
      await axios.patch(`/api/swaps/${id}`, { action }, { withCredentials: true });
      setRequests(prev => prev.filter(r => r._id !== id));
      if (action === "accept") {
        // Add to connections
        const accepted = requests.find(r => r._id === id);
        if (accepted) {
          const prevConns = getConnections();
          // Avoid duplicates
          if (!prevConns.some(c => c._id === accepted._id)) {
            setConnections([accepted, ...prevConns]);
          }
        }
      }
    } catch {
      // Optionally show error
    } finally {
      setActionBusy("");
    }
  };

  if (loading) return <div className="pt-24 md:ml-64">Loading...</div>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar />
      <SideBar />
      <div className="mx-auto pt-24 max-w-3xl px-4 md:px-0 md:ml-64 md:pl-10">
  <h2 className="text-2xl font-bold mb-6">Connection Requests Received</h2>
        {requests.length === 0 ? (
          <div className="rounded-xl bg-white/80 p-8 text-center text-gray-500 shadow border border-gray-100">No connection requests received.</div>
        ) : (
          <ul className="space-y-4">
            {requests.map(req => req.from && (
              <li
                key={req._id}
                className="flex items-center gap-4 rounded-xl bg-white/90 p-5 shadow border border-gray-100 group cursor-pointer hover:bg-indigo-50 transition"
                onClick={e => {
                  // Only navigate if not clicking a button
                  if (e.target.tagName !== 'BUTTON') {
                    navigate(`/profile/${req.from._id}`);
                  }
                }}
              >
                <div className="flex flex-col items-center mr-2">
                  {req.from.avatarUrl ? (
                    <img src={req.from.avatarUrl} alt="" width={48} height={48} className="rounded-full border border-indigo-100 object-cover w-12 h-12" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-lg border border-indigo-100">
                      {req.from.firstName ? req.from.firstName[0] : (req.from.fullName ? req.from.fullName[0] : "?")}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-indigo-700 truncate">
                    {`${req.from.firstName || ''} ${req.from.lastName || ''}`.trim() || req.from.fullName || 'Unknown'}
                  </div>
                  <div className="text-gray-600 text-sm mt-1 truncate">{req.message}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-semibold transition"
                    disabled={actionBusy === req._id + 'accept'}
                    onClick={e => { e.stopPropagation(); handleAction(req._id, 'accept'); }}
                  >
                    {actionBusy === req._id + 'accept' ? 'Confirming...' : 'Confirm'}
                  </button>
                  <button
                    className="rounded-lg bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 text-sm font-semibold transition"
                    disabled={actionBusy === req._id + 'decline'}
                    onClick={e => { e.stopPropagation(); handleAction(req._id, 'decline'); }}
                  >
                    {actionBusy === req._id + 'decline' ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}