import React, { useState, useEffect } from "react";
import Navbar from "../components/UserDashboard/Navbar";
import { User, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto py-12 px-6">
        {errMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errMsg}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b">
            <div className="flex items-center space-x-4">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl}
                  alt={getFullName(profile)}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User size={32} className="text-indigo-500" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.firstName || "User"}
                </h2>
                <p className="text-gray-500">{profile?.email}</p>
              </div>
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={saving}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isEditing 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="First Name">
              <input
                type="text"
                name="firstName"
                value={profile?.firstName || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label="Last Name">
              <input
                type="text"
                name="lastName"
                value={profile?.lastName || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label="Role">
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

            <FormField label="Bio" className="md:col-span-2">
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

            <FormField label="Home Town">
              <input
                type="text"
                name="homeTown"
                value={profile?.homeTown || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label="Age">
              <input
                type="number"
                name="age"
                value={profile?.age || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label="Current Position">
              <input
                type="text"
                name="currentPosition"
                value={profile?.currentPosition || ""}
                onChange={handleChange}
                readOnly={!isEditing}
                className={inputClassName}
              />
            </FormField>

            <FormField label="Avatar URL">
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

            <FormField label="Skills Wanted" className="md:col-span-2">
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
            </FormField>

            <FormField label="Skills Offered" className="md:col-span-2">
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
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
}
