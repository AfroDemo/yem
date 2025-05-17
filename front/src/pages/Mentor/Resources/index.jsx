import { useState, useEffect } from "react";
import {
  BookOpen,
  FileText,
  Filter,
  FolderPlus,
  MoreHorizontal,
  Search,
  Share,
  Upload,
} from "lucide-react";
import Button from "../../../components/button";
import Card from "../../../components/card/card";
import CardHeader from "../../../components/card/cardHeader";
import CardTitle from "../../../components/card/cardTitle";
import CardDescription from "../../../components/card/cardDescription";
import CardContent from "../../../components/card/cardContent";
import Input from "../../../components/Input";
import Select from "../../../components/select/select";
import SelectTrigger from "../../../components/select/SelectTrigger";
import SelectValue from "../../../components/select/SelectValue";
import SelectItem from "../../../components/select/SelectItem";
import Badge from "../../../components/badge";
import SelectContent from "../../../components/select/SelectContent";
import TabsList from "../../../components/tab/TabsList";
import TabsTrigger from "../../../components/tab/TabsTrigger";
import TabsContent from "../../../components/tab/TabsContent";
import Avatar from "../../../components/avatar/Avatar";
import AvatarFallback from "../../../components/avatar/AvatarFallback";
import CardFooter from "../../../components/card/cardFooter";
import Tabs from "../../../components/tab/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/DropDowns";
import { useAuth } from "../../../context/AuthContext";
import { get, del } from "../../../utils/api";

export default function MentorResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    shared: 0,
    types: {},
  });

  useEffect(() => {
    fetchResources();
  }, [user.id, searchQuery, sortBy, activeTab]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        mentorId: user.id,
        ...(searchQuery && { query: searchQuery }),
        ...(activeTab !== "all" && { type: activeTab }),
      });

      const response = await get(`/resources?${params}`);
      const fetchedResources = response.data;

      setResources(fetchedResources);

      // Calculate stats
      const typeCounts = fetchedResources.reduce((acc, res) => {
        acc[res.type] = (acc[res.type] || 0) + 1;
        return acc;
      }, {});

      setStats({
        total: fetchedResources.length,
        shared: fetchedResources.filter((r) => r.sharedWith.length > 0).length,
        types: typeCounts,
      });
    } catch (err) {
      setError("Failed to load resources. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      await del(`/resources/${resourceId}`);
      setResources(resources.filter((r) => r.id !== resourceId));
    } catch (err) {
      console.error("Delete resource error:", err);
      setError("Failed to delete resource.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortResources = (resources) => {
    switch (sortBy) {
      case "name":
        return [...resources].sort((a, b) => a.title.localeCompare(b.title));
      case "type":
        return [...resources].sort((a, b) => a.type.localeCompare(b.type));
      case "shared":
        return [...resources].sort(
          (a, b) => b.sharedWith.length - a.sharedWith.length
        );
      case "recent":
      default:
        return [...resources].sort(
          (a, b) => new Date(b.publishDate) - new Date(a.publishDate)
        );
    }
  };

  const groupedResources = sortResources(resources).reduce((acc, resource) => {
    const category = resource.category || "Other";
    acc[category] = acc[category] || [];
    acc[category].push(resource);
    return acc;
  }, {});

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mentoring Resources</h1>
          <p className="text-gray-500">
            Manage and share resources with your mentees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button asChild>
            <a href="/mentor/resources/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </a>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search resources..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="type">Resource Type</SelectItem>
                <SelectItem value="shared">Most Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Document">Documents</TabsTrigger>
              <TabsTrigger value="Spreadsheet">Spreadsheets</TabsTrigger>
              <TabsTrigger value="Video">Videos</TabsTrigger>
              <TabsTrigger value="Link">Links</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {Object.entries(groupedResources).map(
                ([category, categoryResources]) => (
                  <div key={category} className="space-y-2">
                    <h3 className="font-medium">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryResources.map((resource) => (
                        <ResourceCard
                          key={resource.id}
                          title={resource.title}
                          type={resource.type}
                          size={
                            resource.fileUrl
                              ? `${(Math.random() * 10).toFixed(1)} MB`
                              : null
                          }
                          dateAdded={new Date(
                            resource.publishDate
                          ).toLocaleDateString()}
                          sharedWith={resource.sharedWith.map(
                            (u) => `${u.firstName} ${u.lastName}`
                          )}
                          description={resource.description}
                          url={
                            resource.type === "Link" ? resource.fileUrl : null
                          }
                          onDelete={() => handleDelete(resource.id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
              {resources.length === 0 && (
                <p className="text-gray-500">No resources found.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Resource Statistics</CardTitle>
              <CardDescription>
                Overview of your resource library
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Total Resources</p>
                    <p className="text-sm text-gray-500">In your library</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Share className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Shared Resources</p>
                    <p className="text-sm text-gray-500">With mentees</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">{stats.shared}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resource Types</CardTitle>
              <CardDescription>Breakdown by format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(stats.types).map(([type, count]) => (
                <Button
                  key={type}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Badge
                    className={`mr-2 ${
                      type === "PDF"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : type === "Document"
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : type === "Spreadsheet"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : type === "Presentation"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : type === "Video"
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                        : type === "Link"
                        ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {count}
                  </Badge>
                  {type}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recently Shared</CardTitle>
              <CardDescription>Resources shared with mentees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resources
                .filter((r) => r.sharedWith.length > 0)
                .slice(0, 3)
                .map((resource) => (
                  <div key={resource.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{resource.title}</p>
                      {new Date(resource.publishDate) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Shared with{" "}
                      {resource.sharedWith
                        .map((u) => `${u.firstName} ${u.lastName}`)
                        .join(", ")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(resource.publishDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              {resources.filter((r) => r.sharedWith.length > 0).length ===
                0 && (
                <p className="text-gray-500">No recently shared resources.</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/mentor/resources">View All Shared Resources</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  type,
  size,
  dateAdded,
  sharedWith,
  description,
  url,
  onDelete,
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-md ${
                type === "PDF"
                  ? "bg-red-100"
                  : type === "Document"
                  ? "bg-blue-100"
                  : type === "Spreadsheet"
                  ? "bg-green-100"
                  : type === "Presentation"
                  ? "bg-amber-100"
                  : type === "Video"
                  ? "bg-purple-100"
                  : type === "Link"
                  ? "bg-indigo-100"
                  : "bg-gray-100"
              }`}
            >
              <FileText
                className={`h-4 w-4 ${
                  type === "PDF"
                    ? "text-red-600"
                    : type === "Document"
                    ? "text-blue-600"
                    : type === "Spreadsheet"
                    ? "text-green-600"
                    : type === "Presentation"
                    ? "text-amber-600"
                    : type === "Video"
                    ? "text-purple-600"
                    : type === "Link"
                    ? "text-indigo-600"
                    : "text-gray-600"
                }`}
              />
            </div>
            <div>
              <h4 className="font-medium">{title}</h4>
              <div className="flex items-center mt-1">
                <Badge
                  className={`${
                    type === "PDF"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : type === "Document"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : type === "Spreadsheet"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : type === "Presentation"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : type === "Video"
                      ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                      : type === "Link"
                      ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {type}
                </Badge>
                {size && (
                  <span className="text-xs text-gray-500 ml-2">{size}</span>
                )}
                {url && (
                  <a
                    href={url}
                    className="text-xs text-blue-600 ml-2 hover:underline"
                  >
                    {url}
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Added: {dateAdded}</p>
              {sharedWith && sharedWith.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Shared with:</p>
                  <div className="flex -space-x-2 mt-1">
                    {sharedWith.map((person, index) => (
                      <Avatar
                        key={index}
                        className="border-2 border-white h-6 w-6"
                      >
                        <AvatarFallback className="text-xs">
                          {person
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {sharedWith.length > 3 && (
                      <div className="flex items-center justify-center border-2 border-white bg-gray-100 h-6 w-6 rounded-full text-xs">
                        +{sharedWith.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {description && <p className="text-sm mt-2">{description}</p>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={onDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
