import { useRef, useState } from "react";
import Card from "../components/card/card";
import CardTitle from "../components/card/cardTitle";
import CardDescription from "../components/card/cardDescription";
import Button from "../components/button";
import CardHeader from "../components/card/cardHeader";
import CardContent from "../components/card/cardContent";
import CardFooter from "../components/card/cardFooter";
import TabsList from "../components/tab/TabsList";
import TabsTrigger from "../components/tab/TabsTrigger";
import TabsContent from "../components/tab/TabsContent";
import Label from "../components/Label";
import Avatar from "../components/avatar/Avatar";
import AvatarImage from "../components/avatar/AvatarImage";
import AvatarFallback from "../components/avatar/AvatarFallback";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import { useUser } from "../context/UserContext";
import { updateUser, uploadProfileImage } from "../services/userService";
import { Loader2 } from "lucide-react";
import {
  getArrayFromJsonString,
  addToJsonArray,
  removeFromJsonArray,
  stringifyArray,
} from "../utils/csvHelpers";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useUser();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedBusinessStages, setSelectedBusinessStages] = useState(() => {
    const stagesJson =
      user.role === "mentor"
        ? user.preferredBusinessStages
        : user.businessStage;

    return getArrayFromJsonString(stagesJson) || [];
  });
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    headline: user.role
      ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
      : "",
    bio: user.bio || "",
    location: user.location || "",
    industries: user.industries || null,
    businessStage: user.businessStage || "",
    preferredBusinessStages: user.preferredBusinessStages,
    skills: user.skills || "",
    interests: user.interests || "",
    experienceYears: user.experienceYears || "",
    availability: user.availability || "",
  });

  const commonInterests = [
    "Entrepreneurship",
    "Leadership",
    "Personal Finance",
    "Software Development",
    "UI/UX Design",
    "Digital Marketing",
    "Public Speaking",
    "Project Management",
    "Career Growth",
    "Freelancing",
    "Startups",
    "Content Creation",
    "Photography",
    "Writing & Blogging",
    "Mobile App Development",
    "Cybersecurity",
    "Artificial Intelligence",
    "Blockchain & Crypto",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "Gaming & Game Development",
    "Investing & Trading",
    "Health & Wellness",
    "Sustainable Living",
    "Networking & Personal Branding",
    "E-learning & EdTech",
    "Product Management",
    "Community Building",
    "Open Source Contribution",
    "Fundraising",
    "Product Development",
    "Marketing Strategy",
    "Sales",
    "Operations",
    "Financial Planning",
    "Team Building",
    "Legal & Compliance",
    "Technology Architecture",
    "Customer Acquisition",
    "Supply Chain",
    "International Expansion",
    "Scaling Business",
    "Funding Opportunities",
    "Product Innovation",
    "Leadership Development",
    "Technical Skills",
    "Industry Networking",
    "Business Model Optimization",
    "Market Research",
  ];

  const commonBusinessStages = [
    "Idea",
    "Planning",
    "Development",
    "Testing",
    "Launch",
    "Growth",
    "Expansion",
    "Maturity",
    "Exit",
  ];

  const commonIndustries = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Agriculture",
    "Construction",
    "Manufacturing",
    "Retail",
    "Real Estate",
    "Transportation",
    "Hospitality & Tourism",
    "Media & Entertainment",
    "Marketing & Advertising",
    "Legal Services",
    "Human Resources",
    "Energy & Utilities",
    "Non-Profit & Social Impact",
    "Government & Public Sector",
    "Telecommunications",
    "Fashion & Beauty",
    "Food & Beverage",
    "E-commerce",
    "Logistics & Supply Chain",
    "Arts & Design",
    "Sports & Fitness",
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddToField = (fieldName, valueToAdd) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: addToJsonArray(prev[fieldName], valueToAdd),
    }));
    setSearchSkill("");
  };

  const handleRemoveFromField = (fieldName, valueToRemove) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: removeFromJsonArray(prev[fieldName], valueToRemove),
    }));
  };

  const handleAddSkill = (skill) => handleAddToField("skills", skill);
  const handleRemoveSkill = (skill) => handleRemoveFromField("skills", skill);

  const handleAddInterest = (interest) =>
    handleAddToField("interests", interest);
  const handleRemoveInterest = (interest) =>
    handleRemoveFromField("interests", interest);

  const handleAddIndustry = (industry) =>
    handleAddToField("industries", industry);
  const handleRemoveIndustry = (industry) =>
    handleRemoveFromField("industries", industry);

  // Business stages stays separate since it has different logic
  const handleAddBusinessStage = (stageToAdd) => {
    const trimmedStage = stageToAdd.trim();

    if (user.role === "mentee") {
      // For mentee, just one selection allowed
      setSelectedBusinessStages([trimmedStage]);
    } else {
      // For mentor, up to 4 selections allowed
      if (selectedBusinessStages.length >= 4) {
        toast.error("You can select up to 4 business stages");
        return;
      }
      if (
        !selectedBusinessStages.some(
          (stage) => stage.toLowerCase() === trimmedStage.toLowerCase()
        )
      ) {
        setSelectedBusinessStages([...selectedBusinessStages, trimmedStage]);
      }
    }
  };

  const handleRemoveBusinessStage = (stageToRemove) => {
    setSelectedBusinessStages(
      selectedBusinessStages.filter(
        (stage) => stage.toLowerCase() !== stageToRemove.toLowerCase()
      )
    );
  };

  const handleSaveChanges = async () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    const updateData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      role: formData.headline.toLowerCase().trim(),
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      availability: formData.availability.trim(),
      experienceYears: formData.experienceYears.trim(),

      // No need to modify these since they're already in the right format
      skills: formData.skills,
      interests: formData.interests,
      industries: formData.industries,

      ...(user.role === "mentor"
        ? {
            preferredBusinessStages: stringifyArray(selectedBusinessStages),
            businessStage: null,
          }
        : {
            businessStage: stringifyArray(selectedBusinessStages),
            preferredBusinessStages: null,
          }),
    };

    try {
      await updateUser(user.id, updateData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, WEBP, or GIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      toast.error("Please upload an image smaller than 5MB.");
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadProfileImage(user.id, file);

      // setUser(prev => ({ ...prev, profileImage: result.profileImage }));

      toast.success(result.message);
    } catch (error) {
      toast.error(error.message || "Failed to update profile image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  console.log(user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[600px]">
          <TabsTrigger
            value="profile"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            active={activeTab === "account"}
            onClick={() => setActiveTab("account")}
          >
            Account
          </TabsTrigger>
        </TabsList>

        {activeTab === "profile" && (
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and how it appears to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={
                          "http://localhost:5000" + user.profileImage ||
                          "/placeholder.svg?height=96&width=96"
                        }
                        alt="Profile picture"
                      />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/jpeg, image/png, image/webp, image/gif"
                      className="hidden"
                      disabled={isUploading}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Change Photo"
                      )}
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        value={formData.headline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-gray-500">
                    Brief description of yourself for your profile.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {user.role === "mentor" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Input
                          id="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experienceYears">
                          Years of Experience
                        </Label>
                        <Input
                          id="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>
                    {user.role === "mentor"
                      ? "Preferred Business Stages"
                      : "Your Business Stage"}
                  </Label>
                  {user.role === "mentor" && (
                    <p className="text-sm text-gray-500">
                      Select up to 4 business stages you can mentor in
                    </p>
                  )}

                  <div className="border rounded-md p-4">
                    {/* Selected stages display */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedBusinessStages.length > 0 ? (
                        selectedBusinessStages.map((stage, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {stage}
                            <button
                              onClick={() => handleRemoveBusinessStage(stage)}
                              className="ml-2 text-gray-500 hover:text-gray-900"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">
                          {user.role === "mentor"
                            ? "No preferred stages selected"
                            : "No business stage selected"}
                        </p>
                      )}
                      {user.role === "mentor" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {4 - selectedBusinessStages.length} selections
                          remaining
                        </p>
                      )}
                    </div>

                    {/* Rest of the component remains the same */}
                    <Input
                      value={searchSkill}
                      onChange={(e) => setSearchSkill(e.target.value)}
                      placeholder="Search business stages..."
                      className="h-8 mb-2"
                    />

                    <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white shadow-inner">
                      {commonBusinessStages
                        .filter((stage) =>
                          stage
                            .toLowerCase()
                            .includes(searchSkill.toLowerCase())
                        )
                        .map((stage, index) => {
                          const isAlreadyAdded =
                            selectedBusinessStages.includes(stage);
                          const isMenteeWithSelection =
                            user.role === "mentee" &&
                            selectedBusinessStages.length > 0;

                          return (
                            <div
                              key={index}
                              className={`px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${
                                isAlreadyAdded || isMenteeWithSelection
                                  ? "text-gray-400 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (!isAlreadyAdded && !isMenteeWithSelection) {
                                  handleAddBusinessStage(stage);
                                }
                              }}
                            >
                              {stage}
                              {isAlreadyAdded && (
                                <span className="ml-2 text-green-500">✓</span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Industries</Label>
                  <div className="border rounded-md p-4">
                    {/* Selected industries */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {getArrayFromJsonString(formData.industries).length >
                      0 ? (
                        getArrayFromJsonString(formData.industries).map(
                          (industry, index) => (
                            <div
                              key={index}
                              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                              {industry}
                              <button
                                onClick={() => handleRemoveIndustry(industry)}
                                className="ml-2 text-gray-500 hover:text-gray-900"
                              >
                                ×
                              </button>
                            </div>
                          )
                        )
                      ) : (
                        <p className="text-sm text-gray-500">
                          No industries added yet
                        </p>
                      )}
                    </div>

                    {/* Search field */}
                    <Input
                      value={searchSkill}
                      onChange={(e) => setSearchSkill(e.target.value)}
                      placeholder="Search industries to add..."
                      className="h-8 mb-2"
                    />

                    {/* Filtered industry suggestions */}
                    <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white shadow-inner">
                      {commonIndustries
                        .filter((industry) =>
                          industry
                            .toLowerCase()
                            .includes(searchSkill.toLowerCase())
                        )
                        .map((industry, index) => {
                          const industriesArray = getArrayFromJsonString(
                            formData.industries
                          );
                          const isAlreadyAdded = industriesArray.some(
                            (s) => s.toLowerCase() === industry.toLowerCase()
                          );

                          return (
                            <div
                              key={index}
                              className={`px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${
                                isAlreadyAdded
                                  ? "text-gray-400 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (!isAlreadyAdded)
                                  handleAddIndustry(industry);
                              }}
                            >
                              {industry}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {user.role === "mentee" && (
                  <div className="space-y-2">
                    <Label>Interests</Label>
                    <div className="border rounded-md p-4">
                      {/* Selected skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getArrayFromJsonString(formData.interests).length >
                        0 ? (
                          getArrayFromJsonString(formData.interests).map(
                            (interest, index) => (
                              <div
                                key={index}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                {interest}
                                <button
                                  onClick={() => handleRemoveInterest(interest)}
                                  className="ml-2 text-gray-500 hover:text-gray-900"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-500">
                            No interests added yet
                          </p>
                        )}
                      </div>

                      {/* Search field */}
                      <Input
                        value={searchSkill}
                        onChange={(e) => setSearchSkill(e.target.value)}
                        placeholder="Search interests to add..."
                        className="h-8 mb-2"
                      />

                      {/* Filtered interest suggestions */}
                      <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white shadow-inner">
                        {commonInterests
                          .filter((interest) =>
                            interest
                              .toLowerCase()
                              .includes(searchSkill.toLowerCase())
                          )
                          .map((interest, index) => {
                            const interestsArray = getArrayFromJsonString(
                              formData.interests
                            );
                            const isAlreadyAdded = interestsArray.some(
                              (s) => s.toLowerCase() === interest.toLowerCase()
                            );
                            return (
                              <div
                                key={index}
                                className={`px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${
                                  isAlreadyAdded
                                    ? "text-gray-400 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (!isAlreadyAdded)
                                    handleAddInterest(interest);
                                }}
                              >
                                {interest}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {user.role === "mentor" && (
                  <div className="space-y-2">
                    <Label>Skills & Expertise</Label>
                    <div className="border rounded-md p-4">
                      {/* Selected skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getArrayFromJsonString(formData.skills).length > 0 ? (
                          getArrayFromJsonString(formData.skills).map(
                            (skill, index) => (
                              <div
                                key={index}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                {skill}
                                <button
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="ml-2 text-gray-500 hover:text-gray-900"
                                >
                                  ×
                                </button>
                              </div>
                            )
                          )
                        ) : (
                          <p className="text-sm text-gray-500">
                            No skills added yet
                          </p>
                        )}
                      </div>

                      {/* Search field */}
                      <Input
                        value={searchSkill}
                        onChange={(e) => setSearchSkill(e.target.value)}
                        placeholder="Search skills to add..."
                        className="h-8 mb-2"
                      />

                      {/* Filtered skill suggestions */}
                      <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white shadow-inner">
                        {commonInterests
                          .filter((skill) =>
                            skill
                              .toLowerCase()
                              .includes(searchSkill.toLowerCase())
                          )
                          .map((skill, index) => {
                            const skillsArray = getArrayFromJsonString(
                              formData.skills
                            );
                            const isAlreadyAdded = skillsArray.some(
                              (s) => s.toLowerCase() === skill.toLowerCase()
                            );

                            return (
                              <div
                                key={index}
                                className={`px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 ${
                                  isAlreadyAdded
                                    ? "text-gray-400 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (!isAlreadyAdded) handleAddSkill(skill);
                                }}
                              >
                                {skill}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {activeTab === "account" && (
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and email preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Update Password</Button>
              </CardFooter>
            </Card>

           
          </TabsContent>
        )}
      </div>
    </div>
  );
}
