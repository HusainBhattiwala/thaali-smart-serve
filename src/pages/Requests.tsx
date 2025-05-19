
import ThaaliChangeRequest from "@/components/dashboard/ThaaliChangeRequest";

const Requests = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Thaali Change Requests</h1>
      
      <div className="max-w-xl mx-auto">
        <ThaaliChangeRequest />
      </div>
    </div>
  );
};

export default Requests;
