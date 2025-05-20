"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import Button from "../../../components/button";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/card/card";
import CardHeader from "../../../components/card/cardHeader";
import CardTitle from "../../../components/card/cardTitle";
import CardDescription from "../../../components/card/cardDescription";
import CardContent from "../../../components/card/cardContent";
import CardFooter from "../../../components/card/cardFooter";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import Textarea from "../../../components/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useAuth } from "../../../context/AuthContext";
import {
  createSession,
  getMentees,
  getMentorSessions,
  getResources,
  updateSession,
  deleteSession,
} from "../../../services/sessionService";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SessionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    duration: "30",
    type: "virtual",
    agenda: "",
    menteeId: "",
    resourceIds: [],
  });
  const [mentees, setMentees] = useState([]);
  const [resources, setResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([fetchMentees(), fetchResources(), fetchSessions()]).finally(
      () => setLoading(false)
    );
  }, [user]);

  const fetchMentees = async () => {
    try {
      const response = await getMentees(user.id);
      setMentees(
        response.map((mentee) => ({
          id: mentee.id,
          name: `${mentee.firstName} ${mentee.lastName}`,
        }))
      );
    } catch (err) {
      setApiError("Failed to load mentees.");
      console.error("Fetch mentees error:", err);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await getResources(user.id);
      setResources(response);
    } catch (err) {
      setApiError("Failed to load resources.");
      console.error("Fetch resources error:", err);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await getMentorSessions(user.id);
      setSessions(response);
    } catch (err) {
      setApiError("Failed to load sessions.");
      console.error("Fetch sessions error:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.time) newErrors.time = "Time is required";
    if (!form.menteeId) newErrors.menteeId = "Select a mentee";
    if (!form.duration) newErrors.duration = "Duration is required";
    if (!form.type) newErrors.type = "Session type is required";
    const selectedDateTime = new Date(`${form.date}T${form.time}`);
    if (selectedDateTime < new Date())
      newErrors.date = "Session cannot be scheduled in the past";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const toggleResource = (resourceId) => {
    setForm((prev) => ({
      ...prev,
      resourceIds: prev.resourceIds.includes(resourceId)
        ? prev.resourceIds.filter((id) => id !== resourceId)
        : [...prev.resourceIds, resourceId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      const sessionData = {
        mentorId: user.id,
        menteeId: form.menteeId,
        title: form.title,
        dateTime: new Date(`${form.date}T${form.time}`).toISOString(),
        duration: parseInt(form.duration),
        type: form.type,
        agenda: form.agenda || "",
        resourceIds: form.resourceIds,
      };
console.log(sessionData)
      if (editingSessionId) {
        await updateSession(editingSessionId, sessionData, user);
        toast.success("Session updated successfully!");
      } else {
        await createSession(sessionData, user);
        toast.success("Session scheduled successfully!");
      }
      resetForm();
      fetchSessions();
    } catch (err) {
      setApiError(err.message || "Failed to save session.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (session) => {
    const dateTime = new Date(session.dateTime);
    setForm({
      title: session.title,
      date: format(dateTime, "yyyy-MM-dd"),
      time: format(dateTime, "HH:mm"),
      duration: session.duration.toString(),
      type: session.type,
      agenda: session.agenda,
      menteeId: session.mentee.id,
      resourceIds: session.resources.map((r) => r.id),
    });
    setEditingSessionId(session.id);
  };

  const handleDelete = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      toast.success("Session canceled successfully!");
      fetchSessions();
    } catch (err) {
      setApiError("Failed to cancel session.");
      console.error("Delete error:", err);
    }
  };

  const openDeleteModal = (sessionId) => {
    setSessionToDelete(sessionId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSessionToDelete(null);
  };

  const confirmDelete = async () => {
    if (sessionToDelete) {
      await handleDelete(sessionToDelete);
    }
    closeDeleteModal();
  };

  const resetForm = () => {
    setForm({
      title: "",
      date: "",
      time: "",
      duration: "30",
      type: "virtual",
      agenda: "",
      menteeId: "",
      resourceIds: [],
    });
    setErrors({});
    setEditingSessionId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/mentor/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Manage Sessions</h1>
      </div>

      {apiError && (
        <div className="text-red-600 flex items-center gap-2">
          {apiError}
          <Button
            variant="link"
            onClick={() => {
              setApiError(null);
              fetchMentees();
              fetchResources();
              fetchSessions();
            }}
          >
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingSessionId ? "Edit Session" : "Schedule Session"}
              </CardTitle>
              <CardDescription>
                Plan a mentoring session with your mentee
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Session Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Marketing Strategy Review"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={errors.date ? "border-red-500" : ""}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs">{errors.date}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className={errors.time ? "border-red-500" : ""}
                  />
                  {errors.time && (
                    <p className="text-red-500 text-xs">{errors.time}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={form.duration}
                  onValueChange={(value) =>
                    setForm({ ...form, duration: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <p className="text-red-500 text-xs">{errors.duration}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Session Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">
                      Virtual (e.g., Zoom)
                    </SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-xs">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea
                  id="agenda"
                  placeholder="Describe the session's goals and topics..."
                  rows={4}
                  value={form.agenda}
                  onChange={(e) => setForm({ ...form, agenda: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mentee">Mentee</Label>
                {loading ? (
                  <p className="text-sm text-gray-500">Loading mentees...</p>
                ) : mentees.length === 0 ? (
                  <p className="text-sm text-gray-500">No mentees available.</p>
                ) : (
                  <Select
                    value={
                      mentees.find((m) => m.id === form.menteeId)?.name || ""
                    } // Pass the name instead of ID
                    onValueChange={(value) => {
                      // Find the mentee with this name and set the ID
                      const selectedMentee = mentees.find(
                        (m) => m.name === value
                      );
                      setForm({ ...form, menteeId: selectedMentee?.id || "" });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mentee" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentees.map((mentee) => (
                        <SelectItem key={mentee.id} value={mentee.name}>
                          {" "}
                          {/* Use name as value */}
                          {mentee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.menteeId && (
                  <p className="text-red-500 text-xs">{errors.menteeId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Resources (Optional)</Label>
                {loading ? (
                  <p className="text-sm text-gray-500">Loading resources...</p>
                ) : resources.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No resources available.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {resources.map((resource) => (
                      <div
                        key={resource.id}
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-gray-100/50 ${
                          form.resourceIds.includes(resource.id)
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.resourceIds.includes(resource.id)}
                          onChange={() => toggleResource(resource.id)}
                          className="h-4 w-4 cursor-pointer"
                          id={`resource-${resource.id}`}
                        />
                        <label
                          htmlFor={`resource-${resource.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {resource.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? "Saving..."
                  : editingSessionId
                  ? "Update Session"
                  : "Schedule Session"}
              </Button>
              {editingSessionId && (
                <Button variant="outline" onClick={resetForm} className="ml-2">
                  Cancel Edit
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                Your scheduled mentoring sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-gray-500">No sessions scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="border rounded-md p-4 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(session.dateTime), "PPPp")}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.duration} minutes
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {session.type}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {session.mentee.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteModal(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Cancellation</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to cancel this session?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
