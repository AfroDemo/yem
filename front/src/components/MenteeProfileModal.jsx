import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../components/ui/dialog";
import { X } from "lucide-react";
import { safeJSONParse } from "../utils/helpers";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function MenteeProfileModal({ mentee, isOpen, onClose }) {
  if (!mentee) return null;

  const industries =
    safeJSONParse(mentee.industries, []).join(", ") || "Not specified";
  const interests =
    safeJSONParse(mentee.interests, []).join(", ") || "Not specified";
  const businessStage =
    safeJSONParse(mentee.businessStage, []).join(", ") || "Not specified";
  const skills = safeJSONParse(mentee.skills, []).join(", ") || "Not specified";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mentee.firstName} {mentee.lastName}
          </DialogTitle>
          <DialogClose>
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              {mentee.profileImage ? (
                <img
                  src={`${API_URL}${mentee.profileImage}`}
                  alt={`${mentee.firstName} ${mentee.lastName}`}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-xl font-semibold">
                  {mentee.firstName?.[0]}
                  {mentee.lastName?.[0]}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Bio</h4>
            <p className="text-sm text-gray-500">
              {mentee.bio || "No bio provided"}
            </p>
          </div>
          <div>
            <h4 className="font-medium">Industry</h4>
            <p className="text-sm text-gray-500">{industries}</p>
          </div>
          <div>
            <h4 className="font-medium">Interests</h4>
            <p className="text-sm text-gray-500">{interests}</p>
          </div>
          <div>
            <h4 className="font-medium">Business Stage</h4>
            <p className="text-sm text-gray-500">{businessStage}</p>
          </div>
          <div>
            <h4 className="font-medium">Skills</h4>
            <p className="text-sm text-gray-500">{skills}</p>
          </div>
          <div>
            <h4 className="font-medium">Location</h4>
            <p className="text-sm text-gray-500">
              {mentee.location || "Not specified"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
