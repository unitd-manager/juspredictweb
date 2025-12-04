import { Button } from "./../components/ui/Button";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useHostname } from "../lib/useHostname";
import { api } from "../api/api";
import { toast } from "./../components/ui/sonner";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const hostname = useHostname();

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("auth_token");
      setIsLoggedIn(!!token);

      const userProfile = localStorage.getItem("user_profile");
      if (userProfile) {
        try {
          const user = JSON.parse(userProfile);
          const name = user.firstName || user.userName || null;
          setUserName(name);
        } catch (e) {
          console.error("Failed to parse user profile from localStorage", e);
          setUserName(null);
        }
      } else {
        setUserName(null);
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

  const markAsRead = async (id: string) => {
    try {
      await api.post("/notification/v1/markmessages", { messageIds: [id], status: "NOTIFICATION_STATUS_READ" });
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
                    <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      <div className="p-4 border-b border-border">
                        <h5 className="text-sm font-medium">Notifications</h5>
                      </div>
                      {
                        notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div key={notification.notificationId} className="p-4 border-b border-border flex justify-between items-center">
                              <p className="text-sm">{notification.notificationMessage}</p>
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.notificationId)}>Mark as Read</Button>
                            </div>
                          ))
                        ) : (
                          <p className="p-4 text-sm text-muted-foreground">No new notifications.</p>
                        )
                      }
                    </div>
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
                <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </>
            )}

            <Button variant="ghost" size="sm" className="md:hidden p-0">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
