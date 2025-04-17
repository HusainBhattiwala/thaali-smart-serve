
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);
  
  const handleLoginSuccess = (isAdmin: boolean) => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-thaali-offwhite p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-full bg-thaali-green mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">MT</span>
            </div>
            <h1 className="text-2xl font-bold text-thaali-green mb-1">MyThaali</h1>
            <p className="text-sm text-muted-foreground">
              Dawoodi Bohra Community Thaali Management
            </p>
          </div>
          
          <LoginForm onSuccess={handleLoginSuccess} />
          
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Use these demo credentials:</p>
            <p>User: 87654321 / password: user</p>
            <p>Admin: 12345678 / password: admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
