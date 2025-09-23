import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/UserDashboard/Navbar";
import SideBar from "../components/SideBar";

function getConnections() {
    try {
        return JSON.parse(localStorage.getItem("connections")) || [];
    } catch {
        return [];
    }
}

export default function Connections() {
    const [connections, setConnections] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setConnections(getConnections());
    }, []);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <Navbar />
            <SideBar />
            <div className="mx-auto pt-24 max-w-4xl px-4 md:px-0 md:ml-64 md:pl-10">
                <h2 className="text-2xl font-bold mb-6">Your Connections</h2>
                {connections.length === 0 ? (
                    <div className="rounded-xl bg-white/80 p-8 text-center text-gray-500 shadow border border-gray-100">No connections yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {connections.map(conn => conn.from && (
                            <div
                                key={conn._id}
                                className="flex flex-col items-center bg-white/90 rounded-2xl shadow border border-gray-100 p-6 group hover:bg-indigo-50 transition"
                            >
                                {conn.from.avatarUrl ? (
                                    <img src={conn.from.avatarUrl} alt="" width={64} height={64} className="rounded-full border border-indigo-100 object-cover w-16 h-16 mb-3" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-2xl border border-indigo-100 mb-3">
                                        {conn.from.firstName ? conn.from.firstName[0] : (conn.from.fullName ? conn.from.fullName[0] : "?")}
                                    </div>
                                )}
                                <div className="text-lg font-semibold text-indigo-700 mb-1 truncate">
                                    {`${conn.from.firstName || ''} ${conn.from.lastName || ''}`.trim() || conn.from.fullName || 'Unknown'}
                                </div>
                                <div className="text-gray-600 text-sm mb-3 truncate w-full text-center">{conn.message}</div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 text-sm font-semibold transition"
                                        onClick={() => navigate(`/profile/${conn.from._id}`)}
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-semibold transition"
                                        // onClick={() => ...}
                                    >
                                        Chat
                                    </button>
                                    <button
                                        className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-semibold transition"
                                        // onClick={() => ...}
                                    >
                                        Meet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}