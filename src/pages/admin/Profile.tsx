import { useEffect, useState } from "react";
import { getProfile } from "../../renderer/services/profileApi";
import { IonIcon } from "@ionic/react";
import {
  personOutline,
  mailOutline,
  keyOutline,
  businessOutline,
  cardOutline,
  calendarOutline,
  checkmarkCircleOutline,
  warningOutline,
  closeOutline,
  timeOutline,
  diamondOutline,
} from "ionicons/icons";

export default function Profile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProfile();
      setData(res.data);
    } catch (err) {
      console.error("Profile load error:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <IonIcon icon={warningOutline} className="text-5xl text-red-500 mx-auto mb-3" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadProfile}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, tenant } = data;

  const isExpiringSoon =
    new Date(tenant.expiry_date) <
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const getDaysRemaining = () => {
    const today = new Date();
    const expiry = new Date(tenant.expiry_date);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="font-inter text-start">
          <h1 className="text-3xl font-bold text-white font-inter">Profile</h1>
          <p className="text-gray-500 text-sm font-inter">
            Manage your account and subscription details
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            <IonIcon icon={personOutline} className="text-xl" />
            <span className="font-semibold">{user.role}</span>
          </div>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center gap-2">
              <IonIcon icon={personOutline} className="text-white text-xl" />
              <h2 className="text-white font-semibold text-lg">User Information</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <IonIcon icon={personOutline} className="text-blue-500 text-lg" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <IonIcon icon={mailOutline} className="text-blue-500 text-lg" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="text-sm font-medium text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <IonIcon icon={keyOutline} className="text-blue-500 text-lg" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Role</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                    user.role === "owner" 
                      ? "bg-purple-100 text-purple-700" 
                      : user.role === "manager"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
            <div className="flex items-center gap-2">
              <IonIcon icon={businessOutline} className="text-white text-xl" />
              <h2 className="text-white font-semibold text-lg">Subscription Details</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">Current Plan</span>
                <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {tenant.plan.toUpperCase()}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">
                ₹{tenant.price}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <IonIcon icon={cardOutline} className="text-purple-500 text-lg" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                    tenant.is_active ? "text-green-600" : "text-red-600"
                  }`}>
                    <IonIcon icon={tenant.is_active ? checkmarkCircleOutline : closeOutline} className="text-sm" />
                    {tenant.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <IonIcon icon={calendarOutline} className="text-purple-500 text-lg" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className={`text-sm font-medium ${
                    isExpiringSoon && tenant.is_active ? "text-orange-600" : "text-gray-800"
                  }`}>
                    {new Date(tenant.expiry_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {tenant.is_active && (
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  isExpiringSoon ? "bg-orange-50" : "bg-green-50"
                }`}>
                  <IonIcon icon={timeOutline} className={`text-lg ${
                    isExpiringSoon ? "text-orange-500" : "text-green-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Days Remaining</p>
                    <p className={`text-sm font-bold ${
                      isExpiringSoon ? "text-orange-600" : "text-green-600"
                    }`}>
                      {daysRemaining} days left
                    </p>
                  </div>
                </div>
              )}

              {isExpiringSoon && tenant.is_active && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2">
                    <IonIcon icon={warningOutline} className="text-red-500 text-lg" />
                    <p className="text-xs text-red-700">
                      Your subscription will expire soon. Please renew to continue using all features.
                    </p>
                  </div>
                </div>
              )}

              {!tenant.is_active && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2">
                    <IonIcon icon={closeOutline} className="text-red-500 text-lg" />
                    <p className="text-xs text-red-700">
                      Your subscription has expired. Please renew to regain access.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Features Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
          <div className="flex items-center gap-2">
            <IonIcon icon={diamondOutline} className="text-white text-xl" />
            <h2 className="text-white font-semibold text-lg">Plan Features</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <IonIcon icon={checkmarkCircleOutline} className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Unlimited Products</p>
                <p className="text-xs text-gray-500">Add as many products as you need</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <IonIcon icon={checkmarkCircleOutline} className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Staff Management</p>
                <p className="text-xs text-gray-500">Manage your team members</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <IonIcon icon={checkmarkCircleOutline} className="text-green-600 text-lg" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Sales Reports</p>
                <p className="text-xs text-gray-500">Detailed analytics and insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}