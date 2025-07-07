"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Tag, FileText } from "lucide-react"; // Removed unused Filter icon
import Button from "../../../components/button";
import { Link } from "react-router-dom";
import Card from "../../../components/card/card";
import CardHeader from "../../../components/card/cardHeader";
import CardTitle from "../../../components/card/cardTitle";
import CardDescription from "../../../components/card/cardDescription";
import CardContent from "../../../components/card/cardContent";
import { useAuth } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import Input from "../../../components/Input";

import { getMenteeResources } from "../../../services/resourceService";

export default function MenteeResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    tag: "",
  });

  useEffect(() => {
    if (!user) {
      setApiError("Please log in to view resources.");
      return;
    }
    setLoading(true);
    fetchResources();
  }, [user, filters]);

  const fetchResources = async () => {
    try {
      const response = await getMenteeResources(user.id, filters);
      // Ensure tags are parsed as arrays
      const parsedResources = response.map((resource) => ({
        ...resource,
        tags: Array.isArray(resource.tags)
          ? resource.tags
          : typeof resource.tags === "string"
          ? JSON.parse(resource.tags)
          : [],
      }));
      setResources(parsedResources);
      setLoading(false);
    } catch (err) {
      setApiError(err.message || "Failed to load resources.");
      console.error("Fetch resources error:", err);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  console.log(resources);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/mentee/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Your Resources</h1>
      </div>

      {apiError && (
        <div className="text-red-600 flex items-center gap-2">
          {apiError}
          <Button
            variant="link"
            onClick={() => {
              setApiError(null);
              fetchResources();
            }}
          >
            Retry
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resources</CardTitle>
          <CardDescription>
            Resources shared with you by your mentors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="Enter category"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">Tag</label>
              <Input
                placeholder="Enter tag"
                value={filters.tag}
                onChange={(e) => handleFilterChange("tag", e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading resources...</p>
          ) : resources.length === 0 ? (
            <p className="text-sm text-gray-500">No resources available.</p>
          ) : (
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="border rounded-md p-4 flex justify-between items-start"
                >
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Creator:</span>{" "}
                      {resource.creator
                        ? `${resource.creator.firstName} ${resource.creator.lastName}`
                        : "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Type:</span> {resource.type}
                    </p>
                    {resource.category && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Category:</span>{" "}
                        {resource.category}
                      </p>
                    )}
                    {resource.description && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Description:</span>{" "}
                        {resource.description}
                      </p>
                    )}
                    {resource.tags && resource.tags.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {resource.tags.join(", ")}
                      </p>
                    )}
                    {resource.fileUrl && (
                      <p className="text-sm text-gray-500 mt-2">
                        <a
                          href={"http://localhost:5000" + resource.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4 inline mr-1" />
                          View Resource
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ToastContainer />
    </div>
  );
}
