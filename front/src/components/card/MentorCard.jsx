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
    </Card>
  );
}

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
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center text-center md:text-left md:items-start">
            <div className="relative">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage
                  src={
                    avatar
                      ? `http://localhost:5000${avatar}`
                      : "/placeholder.svg?height=96&width=96"
                  }
                  alt={name}
                />
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              {verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                  <BadgeCheck className="h-4 w-4" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{role}</p>
            <div className="flex items-center mt-2">
              <Badge
                className={`${
                  industry === "Technology"
                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                    : industry === "Finance"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : industry === "E-commerce"
                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                    : industry === "SaaS"
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {industry}
              </Badge>
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
    </Card>
  );
}
