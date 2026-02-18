"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Edit, Trash2, User } from "lucide-react";
import Card from "../../components/card/card";
import CardHeader from "../../components/card/cardHeader";
import CardTitle from "../../components/card/cardTitle";
import CardContent from "../../components/card/cardContent";
import Button from "../../components/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/avatar/Avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../components/ui/dialog";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  toggleUserVerification,
} from "../../services/userService";
import { safeJSONParse } from "../../utils/helpers";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    if (user?.role !== "admin") {
      toast.error("Unauthorized: Admin access required");
      setLoading(false);
      return;
    }

    try {
      const response = await getAllUsers();
      setUsers(
        response.map((user) => ({
          ...user,
          skills: safeJSONParse(user.skills, []),
          interests: safeJSONParse(user.interests, []),
        }))
      );
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(debounceFetch);
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditUser({
      ...user,
      skills: user.skills.join(", "),
      interests: user.interests.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        email: editUser.email,
        role: editUser.role,
        bio: editUser.bio,
        skills: editUser.skills.split(",").map((s) => s.trim()),
        interests: editUser.interests.split(",").map((i) => i.trim()),
        location: editUser.location,
        isVerified: editUser.isVerified,
      };

      await updateUser(editUser.id, updatedData);
      toast.success("User updated successfully");
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleToggleVerification = async (userId) => {
    try {
      const response = await toggleUserVerification(userId);
      toast.success(response.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard - User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Verified</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              user.profileImage
                                ? `${API_URL}${user.profileImage}`
                                : "/placeholder.svg?height=32&width=32"
                            }
                            alt={user.firstName}
                          />
                          <AvatarFallback>
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.role}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVerification(user.id)}
                        >
                          <CheckCircle
                            className={`h-4 w-4 ${
                              user.isVerified
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogClose>
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          {editUser && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input
                  value={editUser.firstName || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, firstName: e.target.value })
                  }
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input
                  value={editUser.lastName || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={editUser.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Input
                  value={editUser.role || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  placeholder="Role"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Input
                  value={editUser.bio || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, bio: e.target.value })
                  }
                  placeholder="Bio"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Skills (comma-separated)
                </label>
                <Input
                  value={editUser.skills || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, skills: e.target.value })
                  }
                  placeholder="Skills"
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Interests (comma-separated)
                </label>
                <Input
                  value={editUser.interests || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, interests: e.target.value })
                  }
                  placeholder="Interests"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editUser.location || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, location: e.target.value })
                  }
                  placeholder="Location"
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </div>
  );
}
