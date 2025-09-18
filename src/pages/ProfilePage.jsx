import React, { useState, useEffect } from "react";
import Navbar from "../components/UserDashboard/Navbar";
import { User, Loader2, Mail, MapPin, Briefcase, Cake, BookOpen, Star, Users } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const FormField = ({ label, children, className = "" }) => (
  <div className={`space-y-2 ${className}`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const listToString = (arr) => (Array.isArray(arr) ? arr.join(", ") : "");
  const stringToList = (s) =>
    (s || "").split(",").map((x) => x.trim()).filter(Boolean);

  useEffect(() => {
    let cancelled = false;
    
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const { data } = await api.get("/api/auth/me");
        if (!cancelled) {
          if (!data) {
            setErrMsg("Please sign in to view your profile.");
            setProfile(null);
          } else {
            setProfile(data.user || data);
          }
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Profile fetch error:", e.response || e);
          setErrMsg("Couldn't load your profile. Are you signed in?");
          setProfile(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrMsg("");
      
      const payload = {
        ...profile,
        skillsWanted: Array.isArray(profile.skillsWanted) 
          ? profile.skillsWanted 
          : stringToList(profile.skillsWanted),
        skillsOffered: Array.isArray(profile.skillsOffered) 
          ? profile.skillsOffered 
          : stringToList(profile.skillsOffered),
      };

      const { data } = await api.patch("/api/auth/me", payload);
      setProfile(data.user || data);
      setIsEditing(false);
    } catch (e) {
      console.error("Save error:", e.response || e);
      setErrMsg(e.response?.data?.message || "Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getFullName = (profile) => {
    if (!profile) return "";
    return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!profile && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto mt-24 px-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errMsg || "Please sign in to view your profile"}
          </div>
        </div>
      </div>
    );
  }

  const inputClassName = `w-full rounded-lg border ${
    isEditing ? "border-gray-300 bg-white" : "border-gray-200 bg-gray-50"
  } px-4 py-2.5 text-sm transition-colors focus:border-indigo-500 focus:outline-none`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <Navbar />

      {/* Banner/Cover */}
      <div className="relative h-48 md:h-56 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-b-3xl shadow-lg mb-[-4rem] md:mb-[-5rem] flex items-end justify-center">
        {/* Optionally, add a pattern or SVG here for extra flair */}
      </div>

      <div className="max-w-4xl mx-auto pt-0 md:pt-8 px-4 md:px-6">
        {errMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errMsg}
          </div>
        )}

        <div className="relative z-10 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 p-8 md:p-12 mt-[-4rem] md:mt-[-5rem]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b gap-6 md:gap-0">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl}
                    alt={getFullName(profile)}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-indigo-200"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-indigo-200">
                    <User size={48} className="text-indigo-400" />
                  </div>
                )}
                <span className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md border border-gray-200">
                  <Users size={18} className="text-indigo-400" />
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                  {profile?.firstName || "User"} {profile?.lastName}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Mail size={16} className="inline-block mr-1" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-500 font-semibold mt-2">
                  <Star size={16} className="inline-block mr-1" />
                  <span>{profile?.role || "Both"}</span>
                </div>
              </div>
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={saving}
              className={`px-8 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-200
                ${isEditing 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white"
                } disabled:opacity-50`}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Edit Profile"
              )}
            </button>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField label={<span className="flex items-center gap-2"><User size={16}/> First Name</span>}>
              <input
                type="text"
                name="firstName"
                value={profile?.firstName || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><User size={16}/> Last Name</span>}>
              <input
                type="text"
                name="lastName"
                value={profile?.lastName || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><Star size={16}/> Role</span>}>
              <select
                name="role"
                value={profile?.role || "Both"}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClassName}
              >
                <option value="Learner">Learner</option>
                <option value="Mentor">Mentor</option>
                <option value="Both">Both</option>
              </select>
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><BookOpen size={16}/> Bio</span>} className="md:col-span-2">
              <textarea
                name="bio"
                value={profile?.bio || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                rows={4}
                className={inputClassName}
                placeholder={isEditing ? "Tell us about yourself..." : ""}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><MapPin size={16}/> Home Town</span>}>
              <input
                type="text"
                name="homeTown"
                value={profile?.homeTown || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><Cake size={16}/> Age</span>}>
              <input
                type="number"
                name="age"
                value={profile?.age || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><Briefcase size={16}/> Current Position</span>}>
              <input
                type="text"
                name="currentPosition"
                value={profile?.currentPosition || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><User size={16}/> Avatar URL</span>}>
              <input
                type="text"
                name="avatarUrl"
                value={profile?.avatarUrl || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
                placeholder={isEditing ? "Enter image URL..." : ""}
              />
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><BookOpen size={16}/> Skills Wanted</span>} className="md:col-span-2">
              <input
                type="text"
                name="skillsWanted"
                value={Array.isArray(profile?.skillsWanted) 
                  ? listToString(profile.skillsWanted)
                  : profile?.skillsWanted || ""}
                onChange={(e) => setProfile(p => ({
                  ...p,
                  skillsWanted: stringToList(e.target.value)
                }))}
                readOnly={!isEditing}
                className={inputClassName}
                placeholder={isEditing ? "Enter skills separated by commas..." : ""}
              />
              {/* Show as badges if not editing */}
              {!isEditing && Array.isArray(profile?.skillsWanted) && profile.skillsWanted.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skillsWanted.map((skill, idx) => (
                    <span key={idx} className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-pink-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </FormField>

            <FormField label={<span className="flex items-center gap-2"><BookOpen size={16}/> Skills Offered</span>} className="md:col-span-2">
              <input
                type="text"
                name="skillsOffered"
                value={Array.isArray(profile?.skillsOffered)
                  ? listToString(profile.skillsOffered)
                  : profile?.skillsOffered || ""}
                onChange={(e) => setProfile(p => ({
                  ...p,
                  skillsOffered: stringToList(e.target.value)
                }))}
                readOnly={!isEditing}
                className={inputClassName}
                placeholder={isEditing ? "Enter skills separated by commas..." : ""}
              />
              {!isEditing && Array.isArray(profile?.skillsOffered) && profile.skillsOffered.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.skillsOffered.map((skill, idx) => (
                    <span key={idx} className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm border border-indigo-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
}
