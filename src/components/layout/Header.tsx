
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu, User, Home, Calendar, Settings } from "lucide-react";
import { toast } from "sonner";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  if (!user) return null;
  
  const isAdmin = user.role === "admin";
  
  return (
    <header className="bg-white border-b border-thaali-green/20 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-thaali-green flex items-center justify-center mr-2">
            <span className="text-white font-bold">MT</span>
          </div>
          <span className="font-bold text-thaali-green text-xl">MyThaali</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {isAdmin ? (
            <>
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md ${isActive("/admin") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/menu" 
                className={`px-3 py-2 rounded-md ${isActive("/admin/menu") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                Menu Management
              </Link>
              <Link 
                to="/admin/reports" 
                className={`px-3 py-2 rounded-md ${isActive("/admin/reports") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                Reports
              </Link>
              <Link 
                to="/admin/users" 
                className={`px-3 py-2 rounded-md ${isActive("/admin/users") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                Users
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md ${isActive("/dashboard") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                <span className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </span>
              </Link>
              <Link 
                to="/requests" 
                className={`px-3 py-2 rounded-md ${isActive("/requests") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Requests
                </span>
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-md ${isActive("/profile") 
                  ? "bg-thaali-green/10 text-thaali-green-dark" 
                  : "text-gray-600 hover:bg-thaali-green/5"}`}
              >
                <span className="flex items-center">
                  <Settings className="h-4 w-4 mr-1" />
                  Profile
                </span>
              </Link>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <div className="h-9 w-9 rounded-full bg-thaali-green/20 flex items-center justify-center text-thaali-green">
                  <User className="h-5 w-5" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.itsId}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-thaali-green/20 py-2 px-4">
          <ul className="space-y-2">
            {isAdmin ? (
              <>
                <li>
                  <Link 
                    to="/admin" 
                    className={`block px-3 py-2 rounded-md ${isActive("/admin") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/menu" 
                    className={`block px-3 py-2 rounded-md ${isActive("/admin/menu") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Menu Management
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/reports" 
                    className={`block px-3 py-2 rounded-md ${isActive("/admin/reports") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reports
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/users" 
                    className={`block px-3 py-2 rounded-md ${isActive("/admin/users") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Users
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    className={`block px-3 py-2 rounded-md ${isActive("/dashboard") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/requests" 
                    className={`block px-3 py-2 rounded-md ${isActive("/requests") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Requests
                    </span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className={`block px-3 py-2 rounded-md ${isActive("/profile") 
                      ? "bg-thaali-green/10 text-thaali-green-dark" 
                      : "text-gray-600"}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile
                    </span>
                  </Link>
                </li>
              </>
            )}
            <li>
              <button 
                className="w-full text-left px-3 py-2 rounded-md text-red-600 flex items-center"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
