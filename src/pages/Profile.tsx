import React, { useEffect, useRef, useState } from "react";
import { api } from "../api/api";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface UserInfo {
  [key: string]: any;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: {
    year?: number;
    month?: number;
    day?: number;
  };
  userStatus?: string;
  isMaskedEmail?: boolean;
  avatarBase64?: string | null;
}

enum RewardCategoryTypeEnum {
  UNSPECIFIED = "REWARDCATEGORY_TYPE_UNSPECIFIED",
  LOGIN = "REWARDCATEGORY_TYPE_LOGIN",
  PREDICTIONSTREAK = "REWARDCATEGORY_TYPE_PREDICTIONSTREAK",
}

interface RewardMultiplierInfo {
  baseAmt: string;
  multiplier: string;
}

interface RewardInfo {
  categoryType: RewardCategoryTypeEnum | string;
  lastRewardedAt: string;
  multiplierInfo: RewardMultiplierInfo;
}

interface RewardsInfoResponse {
  rewards: RewardInfo[];
  status: {
    type: string;
    details: any[];
  };
}

const formatDate = (maybeTs?: string) => {
  if (!maybeTs) return "—";
  // If timestamp is numeric string: parseInt
  const tsNum = Number(maybeTs);
  if (!Number.isNaN(tsNum)) {
    return new Date(tsNum).toLocaleString();
  }
  // Fallback: try Date parse
  const d = new Date(maybeTs);
  return isNaN(d.getTime()) ? maybeTs : d.toLocaleString();
};

const MAX_AVATAR_BYTES = 1024 * 500; // 500kb suggested

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [origUserInfo, setOrigUserInfo] = useState<UserInfo | null>(null);
  const [rewards, setRewards] = useState<RewardInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  // fetch user info & rewards
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await api.post<{ userInfo: UserInfo }>("/user/v1/getinfo");
        const u = response.userInfo || null;
        setUserInfo(u);
        setOrigUserInfo(JSON.parse(JSON.stringify(u || {}))); // deep copy for cancel
        if (u?.avatarBase64) {
          setAvatarPreview(u.avatarBase64);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    const fetchRewards = async () => {
      try {
        const response = await api.post<RewardsInfoResponse>("/user/v1/getrewards");
        setRewards(response.rewards || []);
      } catch (err) {
        console.error("Failed to fetch rewards:", err);
      }
    };

    fetchUserInfo();
    fetchRewards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const onChooseAvatar = () => {
    inputFileRef.current?.click();
  };

  const handleAvatarSelected = (file?: File) => {
    if (!file) return;
    // basic validation
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file for the avatar.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      // try to still load but warn
      const ok = window.confirm(
        "The selected file is larger than recommended (500KB). Larger images may increase upload time. Continue?"
      );
      if (!ok) return;
    }
    setAvatarFile(file);

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarPreview(dataUrl);
      // also set in userInfo avatarBase64 so it's included when saving
      setUserInfo((prev) => (prev ? { ...prev, avatarBase64: dataUrl } : prev));
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleAvatarSelected(e.target.files[0]);
    }
  };

  // Optional: upload avatar as form-data if your backend expects multipart
  const uploadAvatarToServer = async (file: File) => {
    // Example (uncomment & adapt if backend supports multipart/form-data)
    /*
    const form = new FormData();
    form.append("avatar", file);
    const resp = await api.post("/user/v1/uploadAvatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp;
    */
    return null;
  };

  const handleSave = async () => {
    if (!userInfo) return;
    try {
      setSaving(true);
      // If backend accepts file upload separately, do that first
      if (avatarFile) {
        // await uploadAvatarToServer(avatarFile);
        // For now we attach avatarBase64 to payload which many backends accept
      }

      // Prepare payload: only send editable fields
      const payload: Partial<UserInfo> = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        // do not send username/email if not editable; backend will ignore unknown fields
        avatarBase64: userInfo.avatarBase64 || null,
      };

      await api.post("/user/v1/editinfo", payload);
      // optimistic UI: set not editing and refresh original copy
      setIsEditing(false);
      setOrigUserInfo(JSON.parse(JSON.stringify(userInfo)));
      // optionally re-fetch or show success
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // restore original user info
    setUserInfo(origUserInfo ? JSON.parse(JSON.stringify(origUserInfo)) : userInfo);
    if (origUserInfo?.avatarBase64) {
      setAvatarPreview(origUserInfo.avatarBase64);
    }
    setAvatarFile(null);
  };

  if (loading) {
    return (
  <div className="min-h-screen bg-[#0d0d0f] text-white">
           
        <div className="mt-8">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0f] text-white p-6">
       
        <div className="max-w-2xl mx-auto mt-8 text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white">
     

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE CARD (left, spanning 2 cols on lg) */}
          <section className="lg:col-span-2">
            <div
              className="rounded-3xl p-8
              bg-gradient-to-b from-[#071022]/60 to-[#0d1114]/60
              border border-white/6
              shadow-[inset_6px_6px_16px_rgba(0,0,0,0.7),inset_-6px_-6px_14px_rgba(255,255,255,0.02)]
              backdrop-blur-xl
              "
            >
              <div className="flex items-center gap-6 mb-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div
                    className="relative w-28 h-28 rounded-full flex items-center justify-center overflow-hidden
                    border-2 border-white/6 shadow-[0_8px_24px_rgba(0,0,0,0.7)]
                    "
                    aria-hidden
                  >
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="User avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-10 h-10 text-white/70"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2a5 5 0 00-3.536 8.536A7 7 0 005 17.5V19a1 1 0 001 1h12a1 1 0 001-1v-1.5a7 7 0 00-3.464-6.964A5 5 0 0012 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* small overlay glow */}
                    <span
                      className="absolute -inset-0.5 rounded-full pointer-events-none"
                      style={{
                        boxShadow:
                          "0 6px 24px rgba(12, 22, 35, 0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
                      }}
                    />
                  </div>

                  <div>
                    <h1 className="text-2xl font-semibold leading-tight">
                      {userInfo?.firstName || ""} {userInfo?.lastName || ""}
                    </h1>
                    <p className="text-sm text-white/70">{userInfo?.username}</p>
                  </div>
                </div>

                {/* Avatar controls */}
                <div className="ml-auto flex items-center gap-3">
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileInputChange}
                  />
                  <Button
                    variant="ghost"
                    onClick={onChooseAvatar}
                    className="px-3 py-2 rounded-lg border border-white/6"
                    aria-label="Change avatar"
                  >
                    Change
                  </Button>
                  {avatarPreview && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                        setUserInfo((prev) => (prev ? { ...prev, avatarBase64: null } : prev));
                      }}
                      className="px-3 py-2 rounded-lg"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name */}
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={userInfo?.firstName || ""}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                    className={`mt-2 rounded-xl bg-black/20 border-white/8`}
                    placeholder="First name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={userInfo?.lastName || ""}
                    readOnly={!isEditing}
                    onChange={handleInputChange}
                    className={`mt-2 rounded-xl bg-black/20 border-white/8`}
                    placeholder="Last name"
                  />
                </div>

                {/* Username (readonly) */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={userInfo?.username || ""}
                    readOnly
                    className="mt-2 rounded-xl bg-black/10 border-white/6 text-white/80"
                    placeholder="username"
                  />
                </div>

                {/* Email (readonly) */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={userInfo?.email || ""}
                    readOnly
                    className="mt-2 rounded-xl bg-black/10 border-white/6 text-white/80"
                    placeholder="email"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="flex-1 rounded-xl"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 rounded-xl"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button className="rounded-xl" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* REWARDS CARD (right) */}
          <aside>
            <div
              className="rounded-3xl p-6
              bg-gradient-to-b from-[#071022]/60 to-[#0d1114]/60
              border border-white/6
              shadow-[inset_6px_6px_16px_rgba(0,0,0,0.7),inset_-6px_-6px_14px_rgba(255,255,255,0.02)]
              backdrop-blur-xl
              sticky top-6"
            >
              <h2 className="text-xl font-semibold mb-4">Rewards</h2>

              <div className="space-y-4">
                {rewards.length > 0 ? (
                  rewards.map((r, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl p-4 border border-white/4 bg-black/10"
                    >
                      <p className="text-sm">
                        <span className="font-semibold">Category:</span>{" "}
                        <span className="text-white/80">{r.categoryType}</span>
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Last Rewarded At:</span>{" "}
                        <span className="text-white/80">{formatDate(r.lastRewardedAt)}</span>
                      </p>
                      <div className="flex gap-4 mt-3 text-sm">
                        <div>
                          <div className="text-xs text-white/60">Base Amount</div>
                          <div className="font-medium">{r.multiplierInfo?.baseAmt || "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/60">Multiplier</div>
                          <div className="font-medium">{r.multiplierInfo?.multiplier || "—"}</div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-white/60">No rewards available.</div>
                )}
              </div>

              {/* small footer */}
              <div className="mt-6 text-xs text-white/50">
                Rewards are updated automatically when actions are performed.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Profile;
