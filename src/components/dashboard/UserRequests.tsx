
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type ThaaliRequest = {
  id: string;
  request_date: string | null;
  current_type: string;
  requested_type: string;
  status: string;
};

const UserRequests = () => {
  const [requests, setRequests] = useState<ThaaliRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRequests();
    }
  }, [user]);

  const fetchUserRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('thaali_requests')
        .select('*')
        .order('request_date', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="thaali-card animate-fade-in">
      <CardHeader className="bg-thaali-green/10">
        <CardTitle className="text-lg">My Thaali Change Requests</CardTitle>
        <CardDescription>
          View your recent Thaali change requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Current Type</TableHead>
              <TableHead>Requested Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading requests...
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    {request.request_date 
                      ? format(new Date(request.request_date), 'PPP') 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{request.current_type}</TableCell>
                  <TableCell>{request.requested_type}</TableCell>
                  <TableCell>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' 
                        : request.status === 'approved' ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}
                    `}>
                      {request.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserRequests;
