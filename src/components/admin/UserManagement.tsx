import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  its_id: string;
  name: string;
  thaali_type: string;
  phone: string | null;
};

const UserManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newUser, setNewUser] = useState({
    its_id: "",
    name: "",
    thaali_type: "Small",
    phone: ""
  });
  
  const [editUser, setEditUser] = useState<Profile>({
    id: "",
    its_id: "",
    name: "",
    thaali_type: "Small",
    phone: ""
  });
  
  const [deleteUserId, setDeleteUserId] = useState("");
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.its_id.includes(searchTerm)
  );
  
  const handleAddUser = async () => {
    try {
      // Validate ITS ID format (8 digits)
      if (!/^\d{8}$/.test(newUser.its_id)) {
        toast.error("ITS ID must be an 8-digit number");
        return;
      }
      
      // Validate phone number (simple validation)
      if (!/^\d{10}$/.test(newUser.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .insert([{
          its_id: newUser.its_id,
          name: newUser.name,
          thaali_type: newUser.thaali_type,
          phone: newUser.phone,
          role: 'user' // Default role
        }]);
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("A user with this ITS ID already exists");
        } else {
          throw error;
        }
        return;
      }
      
      toast.success("User added successfully");
      setIsAddUserDialogOpen(false);
      setNewUser({ its_id: "", name: "", thaali_type: "Small", phone: "" });
      fetchUsers();
      
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error("Failed to add user");
    }
  };
  
  const handleEditUser = async () => {
    try {
      // Validate phone number (simple validation)
      if (!/^\d{10}$/.test(editUser.phone || '')) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editUser.name,
          thaali_type: editUser.thaali_type,
          phone: editUser.phone,
        })
        .eq('id', editUser.id);
      
      if (error) throw error;
      
      toast.success("User updated successfully");
      setIsEditUserDialogOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user");
    }
  };
  
  const handleDeleteUser = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteUserId);
      
      if (error) throw error;
      
      toast.success("User deleted successfully");
      setIsConfirmDeleteDialogOpen(false);
      fetchUsers();
      
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Failed to delete user");
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="thaali-card">
        <CardHeader className="bg-thaali-green/10 pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">User Management</CardTitle>
              <CardDescription>
                Add, edit, and remove users
              </CardDescription>
            </div>
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-thaali-green hover:bg-thaali-green-dark">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the user's details below
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="itsId">ITS ID</Label>
                    <Input
                      id="itsId"
                      placeholder="Enter 8-digit ITS ID"
                      value={newUser.its_id}
                      onChange={(e) => setNewUser({ ...newUser, its_id: e.target.value })}
                      className="thaali-input"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="thaali-input"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="thaaliType">Thaali Type</Label>
                    <Select
                      value={newUser.thaali_type}
                      onValueChange={(value) => setNewUser({ ...newUser, thaali_type: value })}
                    >
                      <SelectTrigger id="thaaliType" className="thaali-input">
                        <SelectValue placeholder="Select thaali type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className="thaali-input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-thaali-green hover:bg-thaali-green-dark" 
                    onClick={handleAddUser}
                  >
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or ITS ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 thaali-input"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ITS ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Thaali Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.its_id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.thaali_type}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-thaali-green hover:text-thaali-green-dark hover:bg-thaali-green/10"
                              onClick={() => {
                                setEditUser({ ...user });
                                setIsEditUserDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => {
                                setDeleteUserId(user.id);
                                setIsConfirmDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editItsId">ITS ID</Label>
              <Input
                id="editItsId"
                value={editUser.its_id}
                disabled
                className="bg-muted"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="editName">Name</Label>
              <Input
                id="editName"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="thaali-input"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="editThaaliType">Thaali Type</Label>
              <Select
                value={editUser.thaali_type}
                onValueChange={(value) => setEditUser({ ...editUser, thaali_type: value })}
              >
                <SelectTrigger id="editThaaliType" className="thaali-input">
                  <SelectValue placeholder="Select thaali type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="editPhone">Phone Number</Label>
              <Input
                id="editPhone"
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                className="thaali-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-thaali-green hover:bg-thaali-green-dark" 
              onClick={handleEditUser}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
