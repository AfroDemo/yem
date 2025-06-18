import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  BadgeCheck,
  BookOpen,
  Calendar,
  Link,
  MessageSquare,
  Star,
  UserPlus,
} from "lucide-react";
import Avatar from "../avatar/Avatar";
import AvatarFallback from "../avatar/AvatarFallback";
import AvatarImage from "../avatar/AvatarImage";
import Badge from "../badge";
import Card from "./card";
import CardContent from "./cardContent";
import Button from "../button";
import CardFooter from "./cardFooter";
import Progress from "../progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getIndustryColorClasses,
  getIndustryName,
} from "../../utils/industryUtils";

const parseArray = (val) => {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
    return val
      .replace(/["\\]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return val
      .replace(/["\\]/g, "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
};

export function MentorCard({
  id,
  name,
  avatar,
  role,
  industry,
  experience,
  specialties,
  rating,
  reviews,
  matchPercentage,
  availability,
  verified,
}) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user from context
  const [hasMentorship, setHasMentorship] = useState(false);

  // Fetch mentorship status
  useEffect(() => {
    const checkMentorship = async () => {
      try {
        const response = await api.get(`/mentorships/check/${id}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHasMentorship(response.data.hasMentorship);
      } catch (error) {
        console.error("Error checking mentorship status:", error);
      }
    };
    checkMentorship();
  }, [id, user.id]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <div className="relative">
              <div className="h-20 w-20 mb-2 rounded-full bg-gray-100 overflow-hidden relative">
                {/* Image element - hides completely on error */}
                <img
                  src={avatar ? `http://localhost:5000${avatar}` : ""}
                  alt={name || "User avatar"}
                  className="absolute h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  style={{ display: avatar ? "block" : "none" }}
                />

                {/* Fallback - shows when no image or image fails */}
                <div
                  className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300"
                  style={{ display: !avatar ? "flex" : undefined }}
                >
                  <span className="text-2xl font-semibold text-gray-600">
                    {name ? name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
              </div>

              {/* Verified badge */}
              {verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 flex items-center justify-center">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="sr-only">Verified</span>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{role}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {parseArray(industry).map((ind, idx) => (
                <Badge
                  key={idx}
                  className={`
        ${getIndustryColorClasses(ind).bg}
        ${getIndustryColorClasses(ind).text}
        ${getIndustryColorClasses(ind).hover}
      `}
                >
                  {getIndustryName(ind)}
                </Badge>
              ))}
            </div>

            <div className="flex items-center mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-1 text-xs font-medium">{rating}</span>
              <span className="mx-1 text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{reviews} reviews</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Experience: {experience}
                </p>
                <p className="text-sm text-gray-500">
                  Availability: {availability}
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Match Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={matchPercentage} className="h-2 w-24" />
                    <span className="text-sm font-medium">
                      {matchPercentage}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex mt-4 md:mt-0 md:flex-col gap-2 md:items-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:w-auto"
                  onClick={() => (window.location.href = "/dashboard/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button size="sm" className="flex-1 md:w-auto" asChild>
                  <Link to={`/dashboard/mentors/${id}`}>View Profile</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">About</p>
              <p className="text-sm">
                Experienced {role.toLowerCase()} with expertise in{" "}
                {industry.toLowerCase()} startups. Passionate about helping
                entrepreneurs navigate challenges and achieve their business
                goals.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-xs">1-on-1 Sessions</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Chat Support</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Resource Sharing</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {!hasMentorship && (
        <CardFooter className="bg-blue-100 px-6 py-3">
          <Button
            className="w-full flex items-center justify-center gap-2"
            asChild
            onClick={() => {
              navigate(`/dashboard/mentors/${id}/request`);
            }}
          >
            <UserPlus className="h-4 w-4" />
            <span>Request Mentorship</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export function MentorCardAll({ mentor }) {
  const {
    id,
    firstName,
    lastName,
    profileImage,
    role,
    industries,
    experienceYears,
    availability,
    isVerified,
    bio,
    skills,
  } = mentor;

  const fullName = `${firstName} ${lastName}`;
  const parsedIndustries = parseArray(industries);
  const parsedSkills = parseArray(skills);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasMentorship, setHasMentorship] = useState(false);

  // Fetch mentorship status
  useEffect(() => {
    const checkMentorship = async () => {
      try {
        const response = await api.get(`/mentorship/check/${id}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setHasMentorship(response.data.hasMentorship);
      } catch (error) {
        console.error("Error checking mentorship status:", error);
      }
    };
    checkMentorship();
  }, [id, user.id]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <div className="relative">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage
                  src={
                    profileImage
                      ? `http://localhost:5000${profileImage}`
                      : "/placeholder.svg?height=96&width=96"
                  }
                  alt={fullName}
                />
                <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                  <BadgeCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg">{fullName}</h3>
            <p className="text-sm text-gray-500 capitalize">{role}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {parsedIndustries.map((industry, idx) => (
                <Badge
                  key={idx}
                  className={`${
                    industry.toLowerCase().includes("technology")
                      ? "bg-blue-100 text-blue-800"
                      : industry.toLowerCase().includes("finance")
                      ? "bg-green-100 text-green-800"
                      : industry.toLowerCase().includes("e-commerce")
                      ? "bg-purple-100 text-purple-800"
                      : industry.toLowerCase().includes("saas")
                      ? "bg-amber-100 text-amber-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Experience: {experienceYears || "Not specified"}
                </p>
                <p className="text-sm text-gray-500">
                  Availability: {availability || "Unknown"}
                </p>
              </div>
              <div className="flex mt-4 md:mt-0 md:flex-col gap-2 md:items-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 md:w-auto"
                  onClick={() => (window.location.href = "/dashboard/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button size="sm" className="flex-1 md:w-auto" asChild>
                  <Link to={`/dashboard/mentors/${id}`}>View Profile</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">About</p>
              <p className="text-sm">{bio || "No bio available."}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Skills</p>
              <div className="flex flex-wrap gap-2">
                {parsedSkills.length > 0 ? (
                  parsedSkills.map((skill, i) => (
                    <Badge key={i} variant="secondary">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No skills listed</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-xs">1-on-1 Sessions</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Chat Support</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-gray-400" />
                <span className="text-xs">Resource Sharing</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {!hasMentorship && (
        <CardFooter className="bg-gray-100 px-6 py-3">
          <Button
            className="w-full flex items-center justify-center gap-2"
            asChild
            onClick={() => {
              navigate(`/dashboard/mentors/${id}/request`);
            }}
          >
            <UserPlus className="h-4 w-4" />
            <span>Request Mentorship</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
