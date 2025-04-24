
import ThaaliChangeRequest from "@/components/dashboard/ThaaliChangeRequest";
import UserRequests from "@/components/dashboard/UserRequests";

const Requests = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Thaali Change Requests</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThaaliChangeRequest />
        <UserRequests />
      </div>
    </div>
  );
};

export default Requests;
