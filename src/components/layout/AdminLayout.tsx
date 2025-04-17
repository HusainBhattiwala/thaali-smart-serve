
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";

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
  
  return (
    <div className="min-h-screen bg-thaali-offwhite flex flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto max-w-screen-xl">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-thaali-green/20 py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} MyThaali Admin - Dawoodi Bohra Community
      </footer>
    </div>
  );
};

export default AdminLayout;
