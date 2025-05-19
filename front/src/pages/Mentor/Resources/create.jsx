"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  File,
  FileText,
  Info,
  Link2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import Button from "../../../components/button";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/card/card";
import CardHeader from "../../../components/card/cardHeader";
import CardTitle from "../../../components/card/cardTitle";
import CardDescription from "../../../components/card/cardDescription";
import CardContent from "../../../components/card/cardContent";
import Label from "../../../components/Label";
import Input from "../../../components/Input";
import Textarea from "../../../components/Textarea";
import Badge from "../../../components/badge";
import Switch from "../../../components/Switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/Tooltip";
import Avatar from "../../../components/avatar/Avatar";
import AvatarImage from "../../../components/avatar/AvatarImage";
import AvatarFallback from "../../../components/avatar/AvatarFallback";
import CardFooter from "../../../components/card/cardFooter";
import { RadioGroup, RadioGroupItem } from "../../../components/RadioGroup";
import { useAuth } from "../../../context/AuthContext";
import { createResource, getMentees } from "../../../services/resourceService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

export default function UploadResourcePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    resourceType: "file",
    title: "",
    description: "",
    content: "",
    category: "",
    fileType: "",
    isDraft: false,
    isFeatured: false,
    file: null,
    fileUrl: "",
    tags: [],
    sharedWithIds: [],
  });
  const [mentees, setMentees] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    fetchMentees();
  }, [user?.id]);

  const fetchMentees = async () => {
    try {
      const response = await getMentees(user.id);
      console.log("Mentees response:", response);
      setMentees(
        response.map((mentee) => ({
          id: mentee.id,
          name: `${mentee.firstName} ${mentee.lastName}`,
          avatar: mentee.profileImage || "/placeholder.svg?height=40&width=40",
        }))
      );
    } catch (err) {
      setApiError(
        "No mentees found or failed to load mentees. You can still upload the resource."
      );
      console.error("Fetch mentees error:", err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Category is required";
    if (form.resourceType === "file" && !form.file)
      newErrors.file = "File is required";
    if (form.resourceType === "file" && !form.fileType)
      newErrors.fileType = "File type is required";
    if (form.resourceType === "link" && !form.fileUrl.trim())
      newErrors.fileUrl = "URL is required";
    if (
      form.resourceType === "link" &&
      form.fileUrl &&
      !isValidUrl(form.fileUrl)
    ) {
      newErrors.fileUrl = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const extension = file.name.split(".").pop().toLowerCase();
      let fileType = "Other";

      if (["doc", "docx"].includes(extension)) fileType = "Document";
      else if (["xls", "xlsx", "csv"].includes(extension))
        fileType = "Spreadsheet";
      else if (extension === "pdf") fileType = "PDF";
      else if (["ppt", "pptx"].includes(extension)) fileType = "Presentation";
      else if (["mp4", "mov", "avi"].includes(extension)) fileType = "Video";

      setForm({ ...form, file, fileType, fileUrl: "" });
      setErrors({ ...errors, file: null, fileType: null });
    }
  };

  const toggleMentee = (menteeId) => {
    setForm((prev) => {
      const newSharedWithIds = prev.sharedWithIds.includes(menteeId)
        ? prev.sharedWithIds.filter((id) => id !== menteeId)
        : [...prev.sharedWithIds, menteeId];
      console.log(
        "Toggling mentee:",
        menteeId,
        "New sharedWithIds:",
        newSharedWithIds
      );
      return { ...prev, sharedWithIds: newSharedWithIds };
    });
  };

  const addTag = () => {
    if (currentTag.trim() && !form.tags.includes(currentTag.trim())) {
      setForm({ ...form, tags: [...form.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError(null);

    try {
      // Ensure tags and sharedWithIds are arrays
      if (!Array.isArray(form.tags)) {
        console.warn("form.tags is not an array:", form.tags);
        setForm((prev) => ({ ...prev, tags: [] }));
        throw new Error("Tags must be an array");
      }
      if (!Array.isArray(form.sharedWithIds)) {
        console.warn("form.sharedWithIds is not an array:", form.sharedWithIds);
        setForm((prev) => ({ ...prev, sharedWithIds: [] }));
        throw new Error("Shared mentees must be an array");
      }

      console.log("form.tags:", form.tags, typeof form.tags);
      console.log(
        "form.sharedWithIds:",
        form.sharedWithIds,
        typeof form.sharedWithIds
      );

      const formData = new FormData();
      formData.append("createdById", user.id);
      formData.append("title", form.title);
      formData.append("description", form.description || "");
      formData.append("content", form.content || "");
      formData.append(
        "type",
        form.resourceType === "link" ? "Link" : form.fileType
      );
      formData.append("category", form.category);
      formData.append("tags", JSON.stringify(form.tags));
      formData.append("isDraft", form.isDraft);
      formData.append("isFeatured", form.isFeatured);
      if (form.resourceType === "link") {
        formData.append("fileUrl", form.fileUrl);
      } else if (form.file) {
        formData.append("file", form.file);
      }
      formData.append("sharedWithIds", JSON.stringify(form.sharedWithIds));
      console.log(formData);
      // await createResource(formData);
      // navigate("/mentor/resources");
    } catch (err) {
      const errorMessage =
        err.message === "Tags must be an array" ||
        err.message === "Shared mentees must be an array"
          ? "Invalid form data. Please refresh and try again."
          : err.message || "Failed to upload resource. Please try again.";
      setApiError(errorMessage);
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/mentor/resources">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Upload Resource</h1>
      </div>

      {apiError && (
        <div className="text-red-600 flex items-center gap-2">
          {apiError}
          <Button variant="link" onClick={handleSubmit}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>
              <CardDescription>
                Provide details about the resource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label asChild>
                  <span>Resource Type</span>
                </Label>
                <RadioGroup
                  value={form.resourceType}
                  onValueChange={(value) =>
                    setForm({ ...form, resourceType: value })
                  }
                  className="my-4"
                >
                  <RadioGroupItem
                    value="file"
                    id="file-option"
                    className="hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <Upload className="mr-2 h-5 w-5 text-gray-700" />
                      <span className="font-medium">File Upload</span>
                    </div>
                    <span className="text-sm text-gray-500 mt-1">
                      Upload documents, spreadsheets, or presentations
                    </span>
                  </RadioGroupItem>

                  <RadioGroupItem
                    value="link"
                    id="link-option"
                    className="hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="flex items-center">
                      <Link2 className="mr-2 h-5 w-5 text-gray-700" />
                      <span className="font-medium">External Link</span>
                    </div>
                    <span className="text-sm text-gray-500 mt-1">
                      Share links to web resources or online documents
                    </span>
                  </RadioGroupItem>
                </RadioGroup>
              </div>

              {form.resourceType === "file" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>File</Label>
                    <div
                      className={`border-2 border-dashed rounded-md p-6 text-center hover:bg-gray-100/50 transition-colors cursor-pointer ${
                        errors.file ? "border-red-500" : ""
                      }`}
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <File className="h-8 w-8 text-gray-500" />
                        {form.file ? (
                          <div className="flex flex-col items-center">
                            <p className="text-sm font-medium">
                              {form.file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(form.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500">
                              Drag and drop a file here, or{" "}
                              <span className="text-blue-600">browse</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports documents, spreadsheets, PDFs,
                              presentations, and videos
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.file && (
                      <p className="text-red-500 text-xs">{errors.file}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-type">File Type</Label>
                    <Select
                      value={form.fileType}
                      onValueChange={(value) => {
                        setForm({ ...form, fileType: value });
                        setErrors({ ...errors, fileType: false });
                      }}
                      error={errors.fileType}
                    >
                      <SelectTrigger error={errors.fileType}>
                        <SelectValue
                          placeholder="Select file type"
                          value={form.fileType}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Document">Document</SelectItem>
                        <SelectItem value="Spreadsheet">Spreadsheet</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Presentation">
                          Presentation
                        </SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.fileType && (
                      <p className="text-red-500 text-xs">{errors.fileType}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="fileUrl">Resource URL</Label>
                  <Input
                    id="fileUrl"
                    placeholder="https://..."
                    value={form.fileUrl}
                    onChange={(e) =>
                      setForm({ ...form, fileUrl: e.target.value })
                    }
                    className={errors.fileUrl ? "border-red-500" : ""}
                  />
                  {errors.fileUrl && (
                    <p className="text-red-500 text-xs">{errors.fileUrl}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of this resource..."
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Explain what this resource is for and how mentees can use it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Add additional content or notes (optional)..."
                  rows={4}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Optional text content, such as notes or markdown.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                >
                  <SelectTrigger
                    id="category"
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business-planning">
                      Business Planning
                    </SelectItem>
                    <SelectItem value="fundraising">Fundraising</SelectItem>
                    <SelectItem value="marketing">
                      Marketing & Growth
                    </SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="product">Product Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-xs">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    disabled={!currentTag.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full p-0"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sharing Options</CardTitle>
              <CardDescription>
                Control who can access this resource
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share with all mentees</Label>
                  <p className="text-sm text-gray-500">
                    Make this resource available to all your mentees
                  </p>
                </div>
                <Switch
                  checked={
                    form.sharedWithIds.length === mentees.length &&
                    mentees.length > 0
                  }
                  onCheckedChange={(checked) =>
                    setForm({
                      ...form,
                      sharedWithIds: checked ? mentees.map((m) => m.id) : [],
                    })
                  }
                  disabled={mentees.length === 0}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Share with specific mentees
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Select which mentees should have access to this
                          resource
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                {mentees.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No mentees available to share with.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mentees.map((mentee) => (
                      <div
                        key={mentee.id}
                        className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer hover:bg-gray-100/50 ${
                          form.sharedWithIds.includes(mentee.id)
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                        onClick={() => toggleMentee(mentee.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mentee.avatar} alt={mentee.name} />
                          <AvatarFallback>
                            {mentee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{mentee.name}</span>
                        {form.sharedWithIds.includes(mentee.id) && (
                          <Badge className="ml-auto">Selected</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Preview</CardTitle>
              <CardDescription>How your resource will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-md ${
                      form.fileType === "PDF"
                        ? "bg-red-100"
                        : form.fileType === "Document"
                        ? "bg-blue-100"
                        : form.fileType === "Spreadsheet"
                        ? "bg-green-100"
                        : form.fileType === "Presentation"
                        ? "bg-amber-100"
                        : form.fileType === "Video"
                        ? "bg-purple-100"
                        : form.resourceType === "link"
                        ? "bg-indigo-100"
                        : "bg-gray-100"
                    }`}
                  >
                    <FileText
                      className={`h-4 w-4 ${
                        form.fileType === "PDF"
                          ? "text-red-600"
                          : form.fileType === "Document"
                          ? "text-blue-600"
                          : form.fileType === "Spreadsheet"
                          ? "text-green-600"
                          : form.fileType === "Presentation"
                          ? "text-amber-600"
                          : form.fileType === "Video"
                          ? "text-purple-600"
                          : form.resourceType === "link"
                          ? "text-indigo-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {form.title || "Resource Title"}
                    </h4>
                    <div className="flex items-center mt-1">
                      <Badge
                        className={`${
                          form.fileType === "PDF"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : form.fileType === "Document"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : form.fileType === "Spreadsheet"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : form.fileType === "Presentation"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : form.fileType === "Video"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : form.resourceType === "link"
                            ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {form.resourceType === "link"
                          ? "Link"
                          : form.fileType || "File"}
                      </Badge>
                      {form.file && (
                        <span className="text-xs text-gray-500 ml-2">
                          {(form.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                      {form.fileUrl && (
                        <a
                          href={form.fileUrl}
                          className="text-xs text-blue-600 ml-2 hover:underline truncate max-w-[150px]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {form.fileUrl}
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Added: {new Date().toLocaleDateString()}
                    </p>
                    {form.sharedWithIds.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Shared with:</p>
                        <div className="flex -space-x-2 mt-1">
                          {form.sharedWithIds.slice(0, 3).map((menteeId) => {
                            const mentee = mentees.find(
                              (m) => m.id === menteeId
                            );
                            return mentee ? (
                              <Avatar
                                key={menteeId}
                                className="border-2 border-white h-6 w-6"
                              >
                                <AvatarFallback className="text-xs">
                                  {mentee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ) : null;
                          })}
                          {form.sharedWithIds.length > 3 && (
                            <div className="flex items-center justify-center border-2 border-white bg-gray-100 h-6 w-6 rounded-full text-xs">
                              +{form.sharedWithIds.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-sm mt-2">
                      {form.description ||
                        "Resource description will appear here."}
                    </p>
                    {form.content && (
                      <p className="text-sm mt-2 text-gray-600">
                        {form.content.substring(0, 100) +
                          (form.content.length > 100 ? "..." : "")}
                      </p>
                    )}
                    {form.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {form.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Save as draft</Label>
                  <p className="text-sm text-gray-500">
                    Save without publishing
                  </p>
                </div>
                <Switch
                  checked={form.isDraft}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isDraft: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Feature this resource</Label>
                  <p className="text-sm text-gray-500">
                    Highlight on your profile
                  </p>
                </div>
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isFeatured: checked })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Uploading..." : "Upload Resource"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
