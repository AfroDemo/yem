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

export default function MentorResources() {
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
          <Button onClick={()=>{window.location.href='/mentor/resource/upload'}}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resource
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
              />
            </div>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Select defaultValue="recent">
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

          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h3 className="font-medium">Business Planning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    title="Startup Financial Model Template"
                    type="Spreadsheet"
                    size="245 KB"
                    dateAdded="April 2, 2025"
                    sharedWith={["Alex Johnson", "Sarah Chen"]}
                    description="Comprehensive financial model template for startups, including P&L, cash flow, and balance sheet projections."
                  />
                  <ResourceCard
                    title="Business Plan Template"
                    type="Document"
                    size="125 KB"
                    dateAdded="March 28, 2025"
                    sharedWith={[
                      "Alex Johnson",
                      "David Park",
                      "Emily Rodriguez",
                    ]}
                    description="Structured template for creating a comprehensive business plan with section guidance."
                  />
                  <ResourceCard
                    title="Market Research Guide"
                    type="PDF"
                    size="1.2 MB"
                    dateAdded="March 15, 2025"
                    sharedWith={["Sarah Chen", "Emily Rodriguez"]}
                    description="Step-by-step guide for conducting effective market research for new ventures."
                  />
                  <ResourceCard
                    title="Competitive Analysis Framework"
                    type="Spreadsheet"
                    size="180 KB"
                    dateAdded="March 10, 2025"
                    sharedWith={["Alex Johnson", "David Park"]}
                    description="Template for analyzing competitors across key dimensions with visualization tools."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Fundraising</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    title="Pitch Deck Template"
                    type="Presentation"
                    size="3.5 MB"
                    dateAdded="April 5, 2025"
                    sharedWith={["Alex Johnson", "Sarah Chen"]}
                    description="Investor-ready pitch deck template with guidance for each slide."
                  />
                  <ResourceCard
                    title="Startup Valuation Methods"
                    type="PDF"
                    size="850 KB"
                    dateAdded="March 25, 2025"
                    sharedWith={["Alex Johnson"]}
                    description="Overview of different valuation methodologies for early-stage startups."
                  />
                  <ResourceCard
                    title="Term Sheet Glossary"
                    type="Document"
                    size="95 KB"
                    dateAdded="March 20, 2025"
                    sharedWith={["Sarah Chen"]}
                    description="Comprehensive glossary of terms commonly found in investment term sheets."
                  />
                  <ResourceCard
                    title="Investor Meeting Checklist"
                    type="PDF"
                    size="75 KB"
                    dateAdded="March 18, 2025"
                    sharedWith={["Alex Johnson", "Sarah Chen"]}
                    description="Preparation checklist for investor meetings and due diligence."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Marketing & Growth</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResourceCard
                    title="Digital Marketing Strategy Template"
                    type="Document"
                    size="210 KB"
                    dateAdded="April 8, 2025"
                    sharedWith={["David Park", "Emily Rodriguez"]}
                    description="Comprehensive template for creating a digital marketing strategy with channel planning."
                  />
                  <ResourceCard
                    title="Customer Acquisition Calculator"
                    type="Spreadsheet"
                    size="150 KB"
                    dateAdded="April 1, 2025"
                    sharedWith={["David Park"]}
                    description="Tool for calculating customer acquisition costs and lifetime value across channels."
                  />
                  <ResourceCard
                    title="Content Marketing Planner"
                    type="Spreadsheet"
                    size="185 KB"
                    dateAdded="March 22, 2025"
                    sharedWith={["Emily Rodriguez"]}
                    description="Editorial calendar and content planning tool with performance tracking."
                  />
                  <ResourceCard
                    title="Social Media Strategy Guide"
                    type="PDF"
                    size="1.5 MB"
                    dateAdded="March 15, 2025"
                    sharedWith={["David Park", "Emily Rodriguez"]}
                    description="Platform-specific strategies for building brand presence on social media."
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="documents" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCard
                  title="Business Plan Template"
                  type="Document"
                  size="125 KB"
                  dateAdded="March 28, 2025"
                  sharedWith={["Alex Johnson", "David Park", "Emily Rodriguez"]}
                  description="Structured template for creating a comprehensive business plan with section guidance."
                />
                <ResourceCard
                  title="Term Sheet Glossary"
                  type="Document"
                  size="95 KB"
                  dateAdded="March 20, 2025"
                  sharedWith={["Sarah Chen"]}
                  description="Comprehensive glossary of terms commonly found in investment term sheets."
                />
                <ResourceCard
                  title="Digital Marketing Strategy Template"
                  type="Document"
                  size="210 KB"
                  dateAdded="April 8, 2025"
                  sharedWith={["David Park", "Emily Rodriguez"]}
                  description="Comprehensive template for creating a digital marketing strategy with channel planning."
                />
              </div>
            </TabsContent>
            <TabsContent value="templates" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCard
                  title="Startup Financial Model Template"
                  type="Spreadsheet"
                  size="245 KB"
                  dateAdded="April 2, 2025"
                  sharedWith={["Alex Johnson", "Sarah Chen"]}
                  description="Comprehensive financial model template for startups, including P&L, cash flow, and balance sheet projections."
                />
                <ResourceCard
                  title="Pitch Deck Template"
                  type="Presentation"
                  size="3.5 MB"
                  dateAdded="April 5, 2025"
                  sharedWith={["Alex Johnson", "Sarah Chen"]}
                  description="Investor-ready pitch deck template with guidance for each slide."
                />
                <ResourceCard
                  title="Competitive Analysis Framework"
                  type="Spreadsheet"
                  size="180 KB"
                  dateAdded="March 10, 2025"
                  sharedWith={["Alex Johnson", "David Park"]}
                  description="Template for analyzing competitors across key dimensions with visualization tools."
                />
                <ResourceCard
                  title="Customer Acquisition Calculator"
                  type="Spreadsheet"
                  size="150 KB"
                  dateAdded="April 1, 2025"
                  sharedWith={["David Park"]}
                  description="Tool for calculating customer acquisition costs and lifetime value across channels."
                />
              </div>
            </TabsContent>
            <TabsContent value="videos" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCard
                  title="Pitch Presentation Techniques"
                  type="Video"
                  size="45 MB"
                  dateAdded="April 10, 2025"
                  sharedWith={["Alex Johnson", "Sarah Chen"]}
                  description="Video tutorial on effective pitch presentation techniques and common pitfalls to avoid."
                />
                <ResourceCard
                  title="Financial Modeling Walkthrough"
                  type="Video"
                  size="65 MB"
                  dateAdded="April 3, 2025"
                  sharedWith={["Alex Johnson"]}
                  description="Step-by-step walkthrough of building a financial model for your startup."
                />
              </div>
            </TabsContent>
            <TabsContent value="links" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResourceCard
                  title="Startup Funding Resources"
                  type="Link"
                  dateAdded="April 7, 2025"
                  sharedWith={["Alex Johnson", "Sarah Chen"]}
                  description="Curated list of funding resources, grants, and accelerator programs for startups."
                  url="https://example.com/funding-resources"
                />
                <ResourceCard
                  title="Marketing Analytics Tools"
                  type="Link"
                  dateAdded="April 5, 2025"
                  sharedWith={["David Park"]}
                  description="Collection of free and paid marketing analytics tools for startups."
                  url="https://example.com/marketing-tools"
                />
              </div>
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
                <span className="text-2xl font-bold">32</span>
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
                <span className="text-2xl font-bold">24</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Resource Views</p>
                    <p className="text-sm text-gray-500">Last 30 days</p>
                  </div>
                </div>
                <span className="text-2xl font-bold">87</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Resource Types</CardTitle>
              <CardDescription>Breakdown by format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  12
                </Badge>
                Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-100">
                  8
                </Badge>
                Spreadsheets
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-red-100 text-red-800 hover:bg-red-100">
                  6
                </Badge>
                PDFs
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-purple-100 text-purple-800 hover:bg-purple-100">
                  4
                </Badge>
                Presentations
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Badge className="mr-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                  2
                </Badge>
                Videos
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recently Shared</CardTitle>
              <CardDescription>Resources shared with mentees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">
                    Startup Financial Model Template
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    New
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Shared with Alex Johnson, Sarah Chen
                </p>
                <p className="text-xs text-gray-500">April 2, 2025</p>
              </div>
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">
                    Digital Marketing Strategy Template
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Shared with David Park, Emily Rodriguez
                </p>
                <p className="text-xs text-gray-500">April 8, 2025</p>
              </div>
              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">Pitch Deck Template</p>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Shared with Alex Johnson, Sarah Chen
                </p>
                <p className="text-xs text-gray-500">April 5, 2025</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Shared Resources
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
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
