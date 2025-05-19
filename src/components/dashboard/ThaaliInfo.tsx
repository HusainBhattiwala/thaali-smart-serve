
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ThaaliInfoProps {
  thaaliType: string;
  userId: string;
  userName: string;
}

const ThaaliInfo = ({ thaaliType, userId, userName }: ThaaliInfoProps) => {
  return (
    <Card className="thaali-card animate-fade-in">
      <CardHeader className="bg-thaali-green/10 pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Your Thaali</span>
          <Badge className="bg-thaali-green text-white">{thaaliType}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ITS ID:</span>
            <span className="font-medium">{userId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium">{userName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThaaliInfo;
