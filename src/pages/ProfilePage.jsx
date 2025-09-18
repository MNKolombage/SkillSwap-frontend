import React, { useState, useEffect } from "react";
import Navbar from "../components/UserDashboard/Navbar";
import { User, Loader2, Briefcase, MapPin, Mail, Calendar, Plus, Camera } from "lucide-react";
import axios from "axios";
import SkillsInput from '../components/Profile/SkillsInput';

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

const ProfileStat = ({ label, value }) => (
  <div className="text-center px-4 py-2 bg-indigo-50 rounded-lg">
    <div className="text-2xl font-bold text-indigo-600">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const ProfileSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div className="flex items-center space-x-2 mb-4 text-gray-800">
      <Icon size={20} />
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
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
        firstName: profile.firstName,
        lastName: profile.lastName,
        age: profile.age,
        currentPosition: profile.currentPosition,
        homeTown: profile.homeTown,
        role: profile.role,
        bio: profile.bio || "", // Explicitly include bio
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

      <div className="max-w-6xl mx-auto py-12 px-6">
        {errMsg && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errMsg}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img 
                    src={profile.avatarUrl}
                    alt={getFullName(profile)}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-indigo-50"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center ring-4 ring-indigo-50">
                    <User size={40} className="text-indigo-500" />
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {getFullName(profile)}
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  {profile?.currentPosition && (
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-1" />
                      <span>{profile.currentPosition}</span>
                    </div>
                  )}
                  {profile?.homeTown && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{profile.homeTown}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={saving}
              className={`mt-4 md:mt-0 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isEditing 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
                } disabled:opacity-50 flex items-center`}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isEditing ? (
                <>Save Changes</>
              ) : (
                <>Edit Profile</>
              )}
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ProfileStat label="Skills Offered" value={profile?.skillsOffered?.length || 0} />
            <ProfileStat label="Skills Wanted" value={profile?.skillsWanted?.length || 0} />
            <ProfileStat label="Connections" value="0" />
            <ProfileStat label="Swaps" value="0" />
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <ProfileSection title="Basic Information" icon={User}>
              <div className="space-y-4">
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
                <FormField label="Email">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail size={16} />
                    <span>{profile?.email}</span>
                  </div>
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
              </div>
            </ProfileSection>

            <ProfileSection title="Role & Location" icon={Briefcase}>
              <div className="space-y-4">
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
              </div>
            </ProfileSection>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <ProfileSection title="About Me" icon={User}>
              <FormField label="Bio">
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
            </ProfileSection>

            <ProfileSection title="Skills Exchange" icon={Plus}>
              <div className="space-y-6">
                <FormField label="Skills I Want to Learn">
                  <SkillsInput
                    skills={Array.isArray(profile?.skillsWanted) ? profile.skillsWanted : []}
                    onChange={(newSkills) => setProfile(p => ({
                      ...p,
                      skillsWanted: newSkills
                    }))}
                    isEditing={isEditing}
                    placeholder="Enter a skill you want to learn..."
                  />
                </FormField>

                <FormField label="Skills I Can Teach">
                  <SkillsInput
                    skills={Array.isArray(profile?.skillsOffered) ? profile.skillsOffered : []}
                    onChange={(newSkills) => setProfile(p => ({
                      ...p,
                      skillsOffered: newSkills
                    }))}
                    isEditing={isEditing}
                    placeholder="Enter a skill you can teach..."
                  />
                </FormField>
              </div>
            </ProfileSection>
          </div>
        </div>
      </div>
    </div>
  );
}
