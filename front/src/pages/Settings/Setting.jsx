import { useRef, useState } from "react";
import Card from "../../components/card/card";
import CardTitle from "../../components/card/cardTitle";
import CardDescription from "../../components/card/cardDescription";
import Button from "../../components/button";
import CardHeader from "../../components/card/cardHeader";
import CardContent from "../../components/card/cardContent";
import CardFooter from "../../components/card/cardFooter";
import TabsList from "../../components/tab/TabsList";
import TabsTrigger from "../../components/tab/TabsTrigger";
import TabsContent from "../../components/tab/TabsContent";
import Label from "../../components/Label";
import Avatar from "../../components/avatar/Avatar";
import AvatarImage from "../../components/avatar/AvatarImage";
import AvatarFallback from "../../components/avatar/AvatarFallback";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import { useUser } from "../../context/UserContext";
import { updateUser, uploadProfileImage } from "../../services/userService";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { addToCsv, removeFromCsv } from "../../utils/csvHelpers";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useUser();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchSkill, setSearchSkill] = useState("");
  const [selectedBusinessStages, setSelectedBusinessStages] = useState(
    user.role === "mentor"
      ? (user.preferredBusinessStages || "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : (user.businessStage || "")
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
  );
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    headline: user.role
      ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
      : "",
    bio: user.bio || "",
    location: user.location || "",
    industries: user.industries || "",
    businessStage: user.businessStage || "",
    preferredBusinessStages: user.preferredBusinessStages,
    skills: user.skills || "",
    interests: user.interests || "",
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
    setFormData(prev => ({
      ...prev,
      [fieldName]: addToCsv(prev[fieldName], valueToAdd)
    }));
    setSearchSkill("");
  };
  
  const handleRemoveFromField = (fieldName, valueToRemove) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: removeFromCsv(prev[fieldName], valueToRemove)
    }));
  };

  const handleAddSkill = (skill) => handleAddToField('skills', skill);
  const handleRemoveSkill = (skill) => handleRemoveFromField('skills', skill);
  
  const handleAddInterest = (interest) => handleAddToField('interests', interest);
  const handleRemoveInterest = (interest) => handleRemoveFromField('interests', interest);
  
  const handleAddIndustry = (industry) => handleAddToField('industries', industry);
  const handleRemoveIndustry = (industry) => handleRemoveFromField('industries', industry);
  
  // Business stages stays separate since it has different logic
  const handleAddBusinessStage = (stageToAdd) => {
    const trimmedStage = stageToAdd.trim();
  
    if (user.role === "mentee") {
      setSelectedBusinessStages([trimmedStage]);
    } else {
      if (selectedBusinessStages.length >= 4) {
        toast.error("You can select up to 4 business stages");
        return;
      }
      if (!selectedBusinessStages.includes(trimmedStage)) {
        setSelectedBusinessStages([...selectedBusinessStages, trimmedStage]);
      }
    }
  };

  const handleRemoveBusinessStage = (stageToRemove) => {
    setSelectedBusinessStages(
      selectedBusinessStages.filter((stage) => stage !== stageToRemove)
    );
  };

  const handleSaveChanges = async () => {
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    // Clean comma-separated fields
    const cleanCSV = (str) =>
      str
        ? str
            .split(",")
            .map((s) => s.trim())
            .join(", ")
        : "";

    const updateData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      role: formData.headline.toLowerCase().trim(),
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      skills: cleanCSV(formData.skills),
      interests: cleanCSV(formData.interests),
      industries: cleanCSV(formData.industries),
      ...(user.role === "mentor"
        ? {
            preferredBusinessStages: selectedBusinessStages.join(", "),
            businessStage: "", // Clear mentee field if user is mentor
          }
        : {
            businessStage: selectedBusinessStages.join(", "),
            preferredBusinessStages: "", // Clear mentor field if user is mentee
          }),
    };

    try {
      await updateUser(user.id, updateData);
      toast.success("Profile updated successfully");
    } catch (error) {
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
          {/* <TabsTrigger
            value="notifications"
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            active={activeTab === "privacy"}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </TabsTrigger> */}
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
                    {/* Selected skills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.industries ? (
                        formData.industries
                          .split(",")
                          .map((i) => i.trim())
                          .filter((i) => i)
                          .map((industry, index) => (
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
                          ))
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
                          const isAlreadyAdded =
                            formData.industries &&
                            formData.industries
                              .split(",")
                              .map((s) => s.trim().toLowerCase())
                              .includes(industry.toLowerCase());

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

                {user.role == "mentee" && (
                  <div className="space-y-2">
                    <Label>Interests</Label>
                    <div className="border rounded-md p-4">
                      {/* Selected skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.interests ? (
                          formData.interests
                            .split(",")
                            .map((i) => i.trim())
                            .filter((i) => i)
                            .map((interest, index) => (
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
                            ))
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
                            const isAlreadyAdded =
                              formData.interests &&
                              formData.interests
                                .split(",")
                                .map((s) => s.trim().toLowerCase())
                                .includes(interest.toLowerCase());

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
                        {formData.skills ? (
                          formData.skills
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s)
                            .map((skill, index) => (
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
                            ))
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
                            const isAlreadyAdded =
                              formData.skills &&
                              formData.skills
                                .split(",")
                                .map((s) => s.trim().toLowerCase())
                                .includes(skill.toLowerCase());

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

            {/* <Card>
              <CardHeader>
                <CardTitle>Social Profiles</CardTitle>
                <CardDescription>
                  Connect your social media accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0077B5]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#0077B5"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">LinkedIn</h4>
                      <p className="text-sm text-gray-500">
                        linkedin.com/in/johndoe
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#1DA1F2]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#1DA1F2"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Twitter</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#4267B2]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#4267B2"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Facebook</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#E4405F]/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#E4405F"
                      >
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Instagram</h4>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <Button size="sm">Connect</Button>
                </div>
              </CardContent>
            </Card> */}
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
                {/* <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Verification</Label>
                    <p className="text-sm text-gray-500">
                      Your email has been verified
                    </p>
                  </div>
                  <div className="flex h-5 items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-sm font-medium text-green-500">
                      Verified
                    </span>
                  </div>
                </div> */}
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

            {/* <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-red-300 p-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium text-red-600">Delete Account</h4>
                    <p className="text-sm text-gray-500">
                      Once you delete your account, there is no going back. This
                      action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-fit mt-2"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </TabsContent>
        )}

        {/* {activeTab === "notifications" && (
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <Separator />

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Messages</Label>
                      <p className="text-sm text-gray-500">
                        Receive email notifications for new messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Requests</Label>
                      <p className="text-sm text-gray-500">
                        Receive email notifications for new connection requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Receive email reminders for upcoming events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Resource Updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive emails about new resources in your areas of
                        interest
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Platform Updates</Label>
                      <p className="text-sm text-gray-500">
                        Receive emails about platform updates and new features
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Receive promotional emails and special offers
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  <Separator />

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Messages</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications for new messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Connection Activity</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications for connection activity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Event Reminders</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app reminders for upcoming events
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Resource Recommendations</Label>
                      <p className="text-sm text-gray-500">
                        Receive in-app notifications for recommended resources
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {activeTab === "privacy" && (
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your information and how it's used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Visibility</h3>
                  <Separator />

                  <div className="space-y-2">
                    {" "}
                    <Label htmlFor="profile-visibility">
                      Who can see your profile
                    </Label>
                    <Select defaultValue="connections">
                      <SelectTrigger id="profile-visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections">
                          Connections only
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="connection-visibility">
                      Who can see your connections
                    </Label>
                    <Select defaultValue="connections">
                      <SelectTrigger id="connection-visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections">
                          Connections only
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show online status</Label>
                      <p className="text-sm text-gray-500">
                        Allow others to see when you're online
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connection Requests</h3>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="connection-requests">
                      Who can send you connection requests
                    </Label>
                    <Select defaultValue="everyone">
                      <SelectTrigger id="connection-requests">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections-of-connections">
                          Connections of connections
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Messaging</h3>
                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="messaging-permissions">
                      Who can message you
                    </Label>
                    <Select defaultValue="connections">
                      <SelectTrigger id="messaging-permissions">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="connections">
                          Connections only
                        </SelectItem>
                        <SelectItem value="nobody">Nobody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Read receipts</Label>
                      <p className="text-sm text-gray-500">
                        Let others know when you've read their messages
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Usage</h3>
                  <Separator />

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Personalized recommendations</Label>
                      <p className="text-sm text-gray-500">
                        Allow us to use your data to provide personalized
                        recommendations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Usage analytics</Label>
                      <p className="text-sm text-gray-500">
                        Allow us to collect anonymous usage data to improve our
                        platform
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Privacy Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data & Privacy</CardTitle>
                <CardDescription>
                  Manage your data and download information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium">Download Your Data</h4>
                    <p className="text-sm text-gray-500">
                      You can download a copy of all the data we have stored for
                      your account.
                    </p>
                    <Button variant="outline" size="sm" className="w-fit mt-2">
                      Request Data Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "billing" && (
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4 bg-gray-50">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        Current Plan: Professional
                      </h4>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Your subscription renews on May 15, 2025
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Plan includes:</p>
                      <ul className="text-sm text-gray-500 mt-1 space-y-1">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Access to community forum
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          1-on-1 mentorship sessions
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Advanced courses and workshops
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 text-blue-500"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Weekly mastermind groups
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="outline" className="text-red-600">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Visa ending in 4242</h4>
                        <p className="text-sm text-gray-500">Expires 04/2026</p>
                      </div>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                </div>

                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past invoices and payment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-4 font-medium border-b">
                    <div>Date</div>
                    <div>Description</div>
                    <div>Amount</div>
                    <div className="text-right">Status</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-4 p-4">
                      <div className="text-sm">Apr 15, 2025</div>
                      <div className="text-sm">Professional Plan - Monthly</div>
                      <div className="text-sm">$19.99</div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div className="text-sm">Mar 15, 2025</div>
                      <div className="text-sm">Professional Plan - Monthly</div>
                      <div className="text-sm">$19.99</div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 p-4">
                      <div className="text-sm">Feb 15, 2025</div>
                      <div className="text-sm">Professional Plan - Monthly</div>
                      <div className="text-sm">$19.99</div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          Paid
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Invoices
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )} */}
      </div>
    </div>
  );
}
