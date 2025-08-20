import React, { useState, useEffect } from "react";
import Navbar from "../components/UserDashboard/Navbar";
import { User } from "lucide-react"; 
import axios from "axios";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")); // from login
  const userId = storedUser?.id;

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile from backend
  useEffect(() => {
    if (userId) {
        axios
            .get(`http://localhost:5000/api/auth/profile/${userId}`)
            .then((res) => {
                setProfile(res.data.user);
        })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      });
  } else {
    console.log("No userId found in localStorage");
  }
}, [userId]);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Handle Save
  const handleSave = () => {
    axios
      .patch(`http://localhost:5000/api/auth/update-profile/${userId}`, profile)
      .then((res) => {
        setProfile(res.data.user);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  };

  if (!profile) return <div className="mt-24 text-center">Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-24 px-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={36} className="text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold">
              Hello {profile.fullName || "User"}!
            </h2>
          </div>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md"
            >
              SAVE
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-md"
            >
              EDIT
            </button>
          )}
        </div>

        {/* Profile Details */}
        <div className="space-y-5">
          {/* Full Name (always readonly) */}
          <div>
            <label className="font-semibold">Full Name:</label>
            <input
              type="text"
              value={profile.fullName}
              readOnly
              className="block mt-1 w-full max-w-sm bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Email (always readonly) */}
          <div>
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="block mt-1 w-full max-w-sm bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* Home Town */}
          <div>
            <label className="font-semibold">Home Town:</label>
            <input
              type="text"
              name="homeTown"
              value={profile.homeTown || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`block mt-1 w-full max-w-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md px-3 py-2`}
            />
          </div>

          {/* Age */}
          <div>
            <label className="font-semibold">Age:</label>
            <input
              type="number"
              name="age"
              value={profile.age || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`block mt-1 w-full max-w-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md px-3 py-2`}
            />
          </div>

          {/* Current Position */}
          <div>
            <label className="font-semibold">Current Position:</label>
            <input
              type="text"
              name="currentPosition"
              value={profile.currentPosition || ""}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`block mt-1 w-full max-w-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md px-3 py-2`}
            />
          </div>

          {/* Skills Wanted */}
          <div>
            <label className="font-semibold">Skills Wanted:</label>
            <input
              type="text"
              name="skillsWanted"
              value={profile.skillsWanted?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  skillsWanted: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              readOnly={!isEditing}
              className={`block mt-1 w-full max-w-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md px-3 py-2`}
            />
          </div>

          {/* Skills Offered */}
          <div>
            <label className="font-semibold">Skills Offered:</label>
            <input
              type="text"
              name="skillsOffered"
              value={profile.skillsOffered?.join(", ") || ""}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  skillsOffered: e.target.value.split(",").map((s) => s.trim()),
                })
              }
              readOnly={!isEditing}
              className={`block mt-1 w-full max-w-sm ${
                isEditing ? "bg-white" : "bg-gray-100"
              } border border-gray-300 rounded-md px-3 py-2`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
