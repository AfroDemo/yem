"use client"

import { useState } from "react"
import { ArrowLeft, File, FileText, Info, Link2, Plus, Upload, X } from "lucide-react"
import Button from "../../../components/button"
import { Link } from "react-router-dom"
import Card from "../../../components/card/card"
import CardHeader from "../../../components/card/cardHeader"
import CardTitle from "../../../components/card/cardTitle"
import CardDescription from "../../../components/card/cardDescription"
import CardContent from "../../../components/card/cardContent"
import Label from "../../../components/Label"
import Input from "../../../components/Input"
import Select from "../../../components/select/select"
import SelectTrigger from "../../../components/select/SelectTrigger"
import SelectValue from "../../../components/select/SelectValue"
import SelectItem from "../../../components/select/SelectItem"
import Textarea from "../../../components/Textarea"
import Badge from "../../../components/badge"
import Switch from "../../../components/Switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/Tooltip"
import Avatar from "../../../components/avatar/Avatar"
import AvatarImage from "../../../components/avatar/AvatarImage"
import AvatarFallback from "../../../components/avatar/AvatarFallback"
import SelectContent from "../../../components/select/SelectContent"
import CardFooter from "../../../components/card/cardFooter"
import { RadioGroup, RadioGroupItem } from "../../../components/RadioGroup"

export default function UploadResourcePage() {
  const [resourceType, setResourceType] = useState("file")
  const [fileType, setFileType] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedMentees, setSelectedMentees] = useState([])
  const [tags, setTags] = useState([])
  const [currentTag, setCurrentTag] = useState("")

  const mentees = [
    { id: 1, name: "Alex Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Sarah Chen", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "David Park", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Emily Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "Michael Brown", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 6, name: "Jessica Taylor", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Auto-detect file type
      const extension = file.name.split(".").pop().toLowerCase()
      if (["doc", "docx"].includes(extension)) {
        setFileType("Document")
      } else if (["xls", "xlsx", "csv"].includes(extension)) {
        setFileType("Spreadsheet")
      } else if (extension === "pdf") {
        setFileType("PDF")
      } else if (["ppt", "pptx"].includes(extension)) {
        setFileType("Presentation")
      } else if (["mp4", "mov", "avi"].includes(extension)) {
        setFileType("Video")
      } else {
        setFileType("Other")
      }
    }
  }

  const toggleMentee = (menteeId) => {
    if (selectedMentees.includes(menteeId)) {
      setSelectedMentees(selectedMentees.filter((id) => id !== menteeId))
    } else {
      setSelectedMentees([...selectedMentees, menteeId])
    }
  }

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && currentTag) {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/mentor/resources">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Upload Resource</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Information</CardTitle>
              <CardDescription>Provide details about the resource you're uploading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input id="title" placeholder="Enter a descriptive title..." />
              </div>

              <div className="space-y-2">
                <Label>Resource Type</Label>
                <RadioGroup defaultValue="file" onValueChange={setResourceType} className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="file" />
                    <Label htmlFor="file" className="flex items-center cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      File Upload
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="link" id="link" />
                    <Label htmlFor="link" className="flex items-center cursor-pointer">
                      <Link2 className="mr-2 h-4 w-4" />
                      External Link
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {resourceType === "file" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>File</Label>
                    <div
                      className="border-2 border-dashed rounded-md p-6 text-center hover:bg-gray-100/50 transition-colors cursor-pointer"
                      onClick={() => document.getElementById("file-upload").click()}
                    >
                      <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                      <div className="flex flex-col items-center gap-2">
                        <File className="h-8 w-8 text-gray-500" />
                        {selectedFile ? (
                          <div className="flex flex-col items-center">
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm text-gray-500">
                              Drag and drop a file here, or <span className="text-blue-600">browse</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Supports documents, spreadsheets, PDFs, presentations, and videos
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-type">File Type</Label>
                    <Select value={fileType} onValueChange={setFileType}>
                      <SelectTrigger id="file-type">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Document">Document</SelectItem>
                        <SelectItem value="Spreadsheet">Spreadsheet</SelectItem>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Presentation">Presentation</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="url">Resource URL</Label>
                  <Input id="url" placeholder="https://..." />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Provide a detailed description of this resource..." rows={4} />
                <p className="text-xs text-gray-500">
                  Explain what this resource is for and how mentees can use it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business-planning">Business Planning</SelectItem>
                    <SelectItem value="fundraising">Fundraising</SelectItem>
                    <SelectItem value="marketing">Marketing & Growth</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="product">Product Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Button type="button" onClick={addTag} disabled={!currentTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
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
              <CardDescription>Control who can access this resource</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share with all mentees</Label>
                  <p className="text-sm text-gray-500">Make this resource available to all your mentees</p>
                </div>
                <Switch />
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
                        <p>Select which mentees should have access to this resource</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {mentees.map((mentee) => (
                    <div
                      key={mentee.id}
                      className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer hover:bg-gray-100/50 ${
                        selectedMentees.includes(mentee.id) ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => toggleMentee(mentee.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mentee.avatar} alt={mentee.name} />
                        <AvatarFallback>{mentee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{mentee.name}</span>
                      {selectedMentees.includes(mentee.id) && <Badge className="ml-auto">Selected</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Send notification</Label>
                  <p className="text-sm text-gray-500">Notify selected mentees about this resource</p>
                </div>
                <Switch defaultChecked />
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
                      fileType === "PDF"
                        ? "bg-red-100"
                        : fileType === "Document"
                          ? "bg-blue-100"
                          : fileType === "Spreadsheet"
                            ? "bg-green-100"
                            : fileType === "Presentation"
                              ? "bg-amber-100"
                              : fileType === "Video"
                                ? "bg-purple-100"
                                : "bg-gray-100"
                    }`}
                  >
                    <FileText
                      className={`h-4 w-4 ${
                        fileType === "PDF"
                          ? "text-red-600"
                          : fileType === "Document"
                            ? "text-blue-600"
                            : fileType === "Spreadsheet"
                              ? "text-green-600"
                              : fileType === "Presentation"
                                ? "text-amber-600"
                                : fileType === "Video"
                                  ? "text-purple-600"
                                  : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{document.getElementById("title")?.value || "Resource Title"}</h4>
                    <div className="flex items-center mt-1">
                      <Badge
                        className={`${
                          fileType === "PDF"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : fileType === "Document"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : fileType === "Spreadsheet"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : fileType === "Presentation"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : fileType === "Video"
                                    ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                    : resourceType === "link"
                                      ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {resourceType === "link" ? "Link" : fileType || "File"}
                      </Badge>
                      {selectedFile && (
                        <span className="text-xs text-gray-500 ml-2">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Added: {new Date().toLocaleDateString()}</p>
                    {selectedMentees.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Shared with:</p>
                        <div className="flex -space-x-2 mt-1">
                          {selectedMentees.slice(0, 3).map((menteeId) => {
                            const mentee = mentees.find((m) => m.id === menteeId)
                            return (
                              <Avatar key={menteeId} className="border-2 border-white h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {mentee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )
                          })}
                          {selectedMentees.length > 3 && (
                            <div className="flex items-center justify-center border-2 border-white bg-gray-100 h-6 w-6 rounded-full text-xs">
                              +{selectedMentees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <p className="text-sm mt-2">
                      {document.getElementById("description")?.value || "Resource description will appear here."}
                    </p>
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
                  <p className="text-sm text-gray-500">Save without publishing</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Feature resource</Label>
                  <p className="text-sm text-gray-500">Highlight in resource library</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload Resource
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/mentor/resources">Cancel</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}