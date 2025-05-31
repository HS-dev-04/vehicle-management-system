import { useState, useEffect, useCallback, useMemo } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile, signOut } from "firebase/auth";
import { db, auth } from "../../../Firebase";
import { ToastContainer, toast } from "react-toastify";
import { FaUser, FaEnvelope, FaUserTag, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const ROLE_CONFIG = {
  buyer: {
    label: "Buyer",
    description: "As a buyer, you can browse and purchase vehicles.",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    dashboard: "/buyer-dashboard",
    opposite: "renter"
  },
  renter: {
    label: "Renter", 
    description: "As a renter, you can list vehicles for rent and manage rental requests.",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    dashboard: "/renter",
    opposite: "buyer"
  },
  admin: {
    label: "Admin",
    description: "As an admin, you can manage the entire platform.",
    bgColor: "bg-yellow-100", 
    textColor: "text-yellow-800",
    dashboard: "/admin",
    opposite: null
  }
};
const useUserData = () => {
  const [userInfo, setUserInfo] = useState({
    displayName: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserInfo({
          displayName: auth.currentUser.displayName || userData.name || "",
          email: auth.currentUser.email || "",
          role: userData.role || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return { userInfo, setUserInfo, fetchUserData, loading };
};

const validateDisplayName = (name) => {
  if (!name?.trim()) {
    throw new Error("Name cannot be empty");
  }
  if (name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }
};

const ProfileHeader = () => (
  <div className=" text-black px-6 py-4 flex justify-center items-center">
    <h1 className=" flex items-center">
      <FaUser className="mr-2 small" />
      My Profile
    </h1>
  </div>
);

const ProfileField = ({ icon: Icon, label, value, isEditing, onChange, placeholder, readOnly = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 d-flex items-center">
      <Icon className="mr-1" />
      {label}
    </label>
    {isEditing && !readOnly ? (
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700">
        {value || "Not set"}
      </div>
    )}
  </div>
);

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.admin;
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

const ActionButtons = ({ isEditing, loading, onSave, onCancel, onEdit }) => (
  <div className="mt-6">
    {isEditing ? (
      <div className="flex space-x-3">
        <button
          onClick={onSave}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
        >
          <FaSave className="mr-1" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center"
        >
          <FaTimes className="mr-1" />
          Cancel
        </button>
      </div>
    ) : (
      <button
        onClick={onEdit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <FaEdit className="mr-1" />
        Edit Profile
      </button>
    )}
  </div>
);

const RoleManagement = ({ userInfo, isChangingRole, setIsChangingRole, onRoleChange, loading }) => {
  const currentRoleConfig = ROLE_CONFIG[userInfo.role];
  const oppositeRole = currentRoleConfig?.opposite;

  if (!oppositeRole) return null;

  return (
    <div>
      <h2 className="text-xl  text-gray-800 border-b border-gray-200 pb-2 mb-6 flex items-center">
        <FaUserTag className="mr-2 text-blue-600" />
        Role Management
      </h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <div className="text-sm text-blue-800">
          <strong>Current Role:</strong> {currentRoleConfig.label}
          <br />
          <span className="text-blue-600">{currentRoleConfig.description}</span>
        </div>
      </div>
      
      {isChangingRole ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-3 flex items-center">
            <FaUserTag className="mr-1" />
            Confirm Role Change
          </h3>          <p className="text-yellow-700 mb-4">
            Are you sure you want to change your role from <strong>{currentRoleConfig.label}</strong> to{" "}
            <strong>{ROLE_CONFIG[oppositeRole].label}</strong>?
            <br />
            <span className="text-sm text-yellow-600">
              You will be logged out after the role change and need to log in again.
            </span>
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onRoleChange}
              disabled={loading}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Changing..." : "Confirm Change"}
            </button>
            <button
              onClick={() => setIsChangingRole(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsChangingRole(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center"
        >
          <FaUserTag className="mr-1" />
          Switch to {ROLE_CONFIG[oppositeRole].label}
        </button>
      )}
    </div>
  );
};


const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo, fetchUserData, loading: dataLoading } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [loading, setLoading] = useState(false);

  const canChangeRole = useMemo(() => 
    userInfo.role === "buyer" || userInfo.role === "renter", 
    [userInfo.role]
  );

  const handleUpdateProfile = useCallback(async () => {
    try {
      validateDisplayName(userInfo.displayName);
      
      setLoading(true);
      
      await Promise.all([
        updateProfile(auth.currentUser, {
          displayName: userInfo.displayName.trim()
        }),
        updateDoc(doc(db, "users", auth.currentUser.uid), {
          name: userInfo.displayName.trim()
        })
      ]);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [userInfo.displayName]);
  const handleRoleChange = useCallback(async () => {
    const currentRoleConfig = ROLE_CONFIG[userInfo.role];
    const newRole = currentRoleConfig?.opposite;
    
    if (!newRole) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        role: newRole
      });

      setUserInfo(prev => ({ ...prev, role: newRole }));
      toast.success(`Role changed to ${ROLE_CONFIG[newRole].label} successfully! Logging you out...`);
      setIsChangingRole(false);

      setTimeout(async () => {
        try {
          await signOut(auth);
          navigate("/");
        } catch (error) {
          console.error("Error signing out:", error);
          toast.error("Error logging out. Please refresh the page.");
        }
      }, 2000);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  }, [userInfo.role, setUserInfo, navigate]);

  const handleBackToDashboard = useCallback(() => { 
    const dashboard = ROLE_CONFIG[userInfo.role]?.dashboard;
    if (dashboard) {
      navigate(dashboard);
    } 
  }, [userInfo.role, navigate]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    fetchUserData();
  }, [fetchUserData]);

 
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <ProfileHeader userInfo={userInfo} onBackClick={handleBackToDashboard} />
          
          <div className="p-6 space-y-8"> 
            <div>
              <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
                Profile Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  icon={FaUser}
                  label="Full Name"
                  value={userInfo.displayName}
                  isEditing={isEditing}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Enter your full name"
                />
                
                <ProfileField
                  icon={FaEnvelope}
                  label="Email Address"
                  value={userInfo.email}
                  isEditing={false}
                  readOnly={true}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 d-flex items-center">
                    <FaUserTag className="mr-1" />
                    Current Role
                  </label>
                  <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    <RoleBadge role={userInfo.role} />
                  </div>
                </div>
              </div>
              
              <ActionButtons
                isEditing={isEditing}
                loading={loading}
                onSave={handleUpdateProfile}
                onCancel={handleCancel}
                onEdit={() => setIsEditing(true)}
              /> 
            </div>

            {canChangeRole && (
              <RoleManagement
                userInfo={userInfo}
                isChangingRole={isChangingRole}
                setIsChangingRole={setIsChangingRole}
                onRoleChange={handleRoleChange}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;