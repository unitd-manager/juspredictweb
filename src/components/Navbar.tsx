import { Button } from "./../components/ui/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useHostname } from "../lib/useHostname";
import { api } from "../api/api";
import { toast } from "./../components/ui/sonner";
import NotificationDropDown from "./NotificationDropDown";

interface Notification {
  notificationId: string;
  notificationMessage: string;
  notificationStatus: string;
  notificationMsgCreatedAt: string;
}

declare global {
  interface Window {
    __localStoragePatched?: boolean;
  }
}

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const hostname = useHostname();

function isTokenExpired(): boolean {
  const expiry = localStorage.getItem("token_expiry");

  // ✅ If expiry is missing, DO NOT force logout
  if (!expiry) return false;

  const expiryTime = Number(expiry);

  // ✅ Guard against invalid values (NaN, 0)
  if (!expiryTime || Number.isNaN(expiryTime)) return false;

  return Date.now() >= expiryTime;
}


  useEffect(() => {
//     const syncAuth = () => {
//       const token = localStorage.getItem("auth_token");
//       if (!token || isTokenExpired()) {
//   setIsLoggedIn(false);
//   setUserName(null);

//   if (token) {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("token_expiry");
//     localStorage.removeItem("user_profile");

//     toast.error("Session expired. Please sign in again.");
//   }
//   return;
// }

//       setIsLoggedIn(!!token);

//       const userProfile = localStorage.getItem("user_profile");
//       if (userProfile) {
//         try {
//           const user = JSON.parse(userProfile);
//           const name = user.firstName || user.userName || null;
//           setUserName(name);
//         } catch (e) {
//           console.error("Failed to parse user profile from localStorage", e);
//           setUserName(null);
//         }
//       } else {
//         setUserName(null);
//       }
//     };
const syncAuth = () => {
  const token = localStorage.getItem("auth_token");

  if (!token || isTokenExpired()) {
    setIsLoggedIn(false);
    setUserName(null);
    return;
  }

  setIsLoggedIn(true);

  const userProfile = localStorage.getItem("user_profile");
  if (userProfile) {
    try {
      const user = JSON.parse(userProfile);
      setUserName(user.firstName || user.userName || null);
    } catch {
      setUserName(null);
    }
  }
};
    
syncAuth();

    // Sync across tabs
    window.addEventListener("storage", syncAuth);

    // Sync inside same tab
    const handleLocalStorageCustom = (_e: Event) => {
      syncAuth();
    };
    window.addEventListener("local-storage", handleLocalStorageCustom);

    // Patch setItem once
    if (!window.__localStoragePatched) {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, value: string) {
        originalSetItem.apply(this, [key, value]);
        window.dispatchEvent(
          new CustomEvent("local-storage", { detail: { key, newValue: value } })
        );
      };
      window.__localStoragePatched = true;
    }

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("local-storage", handleLocalStorageCustom);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.post<{ notificationsCount: number }>("/notification/v1/unreadcount", {  
        status: "NOTIFICATION_STATUS_UNREAD" });
      setUnreadCount(response.notificationsCount);
    } catch (error) {
      console.error("Failed to fetch unread notification count", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.post<{ notifications: Notification[] }>("/notification/v1/getlist", {
        pageRequest: {
          pageNumber: 1,
          pageSize: 50, // Assuming a default page size of 10
        },
        status: ["NOTIFICATION_STATUS_UNREAD"],
      });
      setNotifications(response.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) {
      fetchNotifications();
    }
  };
useEffect(() => {
  const interval = setInterval(() => {
    const token = localStorage.getItem("auth_token");

    if (!token || isTokenExpired()) {
      // 🔒 Hard logout
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token_expiry");
      localStorage.removeItem("user_profile");

      setIsLoggedIn(false);
      setUserName(null);

      toast.error("Session expired. Please sign in again.");

      window.dispatchEvent(
        new CustomEvent("local-storage", {
          detail: { key: "auth_token", newValue: null },
        })
      );
    }
  }, 5000); // ⏱ check every 5 seconds

  return () => clearInterval(interval);
}, []);

  // const markAllAsRead = async (id: string) => {
  //   try {
  //     await api.post("/notification/v1/markmessages", { messageIds: [id], status: "NOTIFICATION_STATUS_READ" });
  //     setNotifications(prev => prev.filter(n => n.notificationId !== id));
  //     setUnreadCount(prev => Math.max(0, prev - 1));
  //   } catch (error) {
  //     console.error("Failed to mark notification as read", error);
  //   }
  // };
 const markAsRead = async (id: string) => {
    try {
      await api.post("/notification/v1/update", { notificationId: id, status: "NOTIFICATION_STATUS_READ" });
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const onLogout = async () => {
    try {
      await api.post("/user/v1/logout");
    } catch (error) {
      console.error("Failed to call logout", error);
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user_profile");

    window.dispatchEvent(
      new CustomEvent("local-storage", { detail: { key: "auth_token", newValue: null } })
    );

    setIsLoggedIn(false);
    setUserName(null);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-2">
            <img src={logo} alt="JusPredict Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">JusPredict</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {hostname === "juspredictlive.unitdtechnologies.com" ? (
              <a href="#home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</a>
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
                  }`}>Home</NavLink>

              <NavLink to="/faq" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>FAQ</NavLink>
                <NavLink to="/portfolio" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>Portfolio</NavLink>
                <NavLink to="/clan" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>Clan</NavLink>
                {/* {isLoggedIn && <NavLink to="/profile" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>Profile</NavLink>} */}
                <NavLink to="/sports" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>Sports</NavLink>
                   <NavLink to="/transactions" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>Transactions</NavLink>
                <NavLink to="/about" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>About</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `text-sm font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-gray-light hover:text-primary'
                  }`}>Contact</NavLink>
              
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {userName && <span className="text-sm font-medium text-foreground">Hi, {userName}</span>}
                <div className="relative">
                  <Button variant="ghost" size="sm" onClick={handleBellClick} className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                {showNotifications && (
  <NotificationDropDown
    notifications={notifications}
    onMarkAsRead={markAsRead}
    onClose={() => setShowNotifications(false)}
  />
)}

                </div>
                <Button variant="ghost" className="hidden sm:inline-flex" onClick={onLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="hidden sm:inline-flex bg-primary text-black font-bold" onClick={() => navigate('/signup')}>Sign Up</Button>
              </>
            )}

            <Button variant="ghost" size="sm" className="md:hidden p-3 relative z-50" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-bg border-b border-white/5 relative z-50">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {hostname === "juspredictlive.unitdtechnologies.com" ? (
              <a href="#home" className="block px-3 py-2 text-base font-medium rounded-md transition-colors text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>Home</a>
            ) : (
              <>
                <NavLink to="/" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>Home</NavLink>

              <NavLink to="/faq" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>FAQ</NavLink>
                <NavLink to="/portfolio" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>Portfolio</NavLink>
                <NavLink to="/clan" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>Clan</NavLink>
                <NavLink to="/sports" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>Sports</NavLink>
                <NavLink to="/about" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>About</NavLink>
                <NavLink to="/contact" className={({ isActive }) => `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive ? 'text-primary font-bold bg-white/5' : 'text-gray-light hover:text-primary hover:bg-white/5'
                  }`} onClick={() => setIsOpen(false)}>Contact</NavLink>
              </>
            )}
            <div className="pt-4 flex flex-col gap-3">
              {isLoggedIn ? (
                <Button variant="ghost" className="w-full text-white" onClick={onLogout}>Logout</Button>
              ) : (
                <>
                  <Button variant="ghost" className="w-full text-white" onClick={() => navigate('/login')}>Login</Button>
                  <Button className="w-full bg-primary text-black font-bold" onClick={() => navigate('/signup')}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
