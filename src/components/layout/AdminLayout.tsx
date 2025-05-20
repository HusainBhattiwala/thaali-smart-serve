
import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  FileBarChart, 
  UtensilsCrossed,
  Star
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
      return;
    }
    
    const userData = JSON.parse(user);
    if (userData.role !== "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Menu Management", path: "/admin/menu", icon: UtensilsCrossed },
    { name: "Reports", path: "/admin/reports", icon: FileBarChart },
    { name: "User Management", path: "/admin/users", icon: Users },
    { name: "Feedback", path: "/admin/feedback", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-thaali-offwhite flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:flex w-56 flex-col bg-white border-r border-thaali-green/20">
          <div className="p-4">
            <h2 className="font-semibold text-lg text-thaali-green">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            {navItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 container mx-auto max-w-screen-xl">
          <Outlet />
        </main>
      </div>
      <footer className="bg-white border-t border-thaali-green/20 py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} MyThaali Admin - Dawoodi Bohra Community
      </footer>
    </div>
  );
};

export default AdminLayout;
