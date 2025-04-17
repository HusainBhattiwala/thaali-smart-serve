
import ProfileInfo from "./ProfileInfo";
import PhoneUpdateForm from "./PhoneUpdateForm";
import PasswordChangeForm from "./PasswordChangeForm";

interface UserProfileProps {
  user: {
    itsId: string;
    name: string;
    thaaliType: string;
    phone?: string;
  };
}

const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <ProfileInfo user={user} />
      <PhoneUpdateForm initialPhone={user.phone || ""} />
      <PasswordChangeForm />
    </div>
  );
};

export default UserProfile;
