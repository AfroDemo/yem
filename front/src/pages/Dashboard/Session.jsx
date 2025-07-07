import { useState, useEffect } from "react";
   import { ArrowLeft, Calendar, Clock, Video, Users, Trash2 } from "lucide-react";
   import Button from "../../components/button";
   import { Link } from "react-router-dom";
   import Card from "../../components/card/card";
   import CardHeader from "../../components/card/cardHeader";
   import CardTitle from "../../components/card/cardTitle";
   import CardDescription from "../../components/card/cardDescription";
   import CardContent from "../../components/card/cardContent";
   import { useAuth } from "../../context/AuthContext";
   import { getMenteeSessions, deleteSession } from "../../services/sessionService";
   import { format } from "date-fns";
   import { ToastContainer, toast } from "react-toastify";
   import "react-toastify/dist/ReactToastify.css";

   export default function MenteeSessionsPage() {
     const { user } = useAuth();
     const [sessions, setSessions] = useState([]);
     const [loading, setLoading] = useState(false);
     const [apiError, setApiError] = useState(null);
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const [sessionToDelete, setSessionToDelete] = useState(null);

     useEffect(() => {
       if (!user) {
         console.log("No user found in AuthContext");
         setApiError("Please log in to view sessions.");
         return;
       }
       console.log("User:", { id: user.id, role: user.role });
       setLoading(true);
       fetchSessions();
     }, [user]);

     const fetchSessions = async () => {
       try {
         console.log("Fetching sessions for menteeId:", user.id);
         const response = await getMenteeSessions(user.id);
         console.log("Sessions response:", response);
         setSessions(response);
         setLoading(false);
       } catch (err) {
         const errorMessage = err.message || "Failed to load sessions.";
         setApiError(errorMessage);
         console.error("Fetch sessions error:", err);
         setLoading(false);
       }
     };

     const handleDelete = async (sessionId) => {
       try {
         await deleteSession(sessionId);
         toast.success("Session cancelled successfully!");
         fetchSessions();
       } catch (err) {
         const errorMessage = err.message || "Failed to cancel session.";
         setApiError(errorMessage);
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

     return (
       <div className="space-y-6">
         <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon">
             <Link to="/mentee/dashboard" className="flex items-center justify-center h-full w-full">
               <ArrowLeft className="h-5 w-5" />
             </Link>
           </Button>
           <h1 className="text-3xl font-bold">Your Sessions</h1>
         </div>

         {apiError && (
           <div className="text-red-600 flex items-center gap-2">
             {apiError}
             <Button
               variant="link"
               onClick={() => {
                 setApiError(null);
                 fetchSessions();
               }}
             >
               Retry
             </Button>
           </div>
         )}

         <Card>
           <CardHeader>
             <CardTitle>Upcoming Sessions</CardTitle>
             <CardDescription>Your scheduled mentoring sessions</CardDescription>
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
                         {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                       </p>
                       <p className="text-sm text-gray-500 flex items-center gap-1">
                         <Users className="h-4 w-4" />
                         Mentor: {session.mentor.name}
                       </p>
                       {session.agenda && (
                         <p className="text-sm text-gray-500 mt-2">
                           <span className="font-medium">Agenda:</span> {session.agenda}
                         </p>
                       )}
                       {session.resources.length > 0 && (
                         <p className="text-sm text-gray-500 mt-2">
                           <span className="font-medium">Resources:</span>{" "}
                           {session.resources.map((r) => r.title).join(", ")}
                         </p>
                       )}
                     </div>
                     <div className="flex gap-2">
                       {session.status === "upcoming" && (
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => openDeleteModal(session.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
         </Card>

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