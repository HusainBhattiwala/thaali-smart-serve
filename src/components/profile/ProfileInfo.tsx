
import { User } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface ProfileInfoProps {
  user: {
    itsId: string;
    name: string;
    thaaliType: string;
  };
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  return (
    <Card className="thaali-card">
      <CardHeader className="bg-thaali-green/10">
        <CardTitle className="text-lg">Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-thaali-green/20 flex items-center justify-center">
            <User className="h-10 w-10 text-thaali-green" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ITS ID:</span>
            <span className="font-medium">{user.itsId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thaali Type:</span>
            <Badge className="bg-thaali-green text-white">{user.thaaliType}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
