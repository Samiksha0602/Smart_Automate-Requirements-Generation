"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  FileOutput,
  History,
  Edit,
  Trash2,
  Copy,
  Eye,
  ArrowUpDown,
  Upload,
} from "lucide-react"

// Mock data for documents
const mockDocuments = [
  {
    id: 1,
    name: "ERP System Requirements",
    createdBy: "John Doe",
    createdOn: "2023-09-15",
    type: "Functional",
    status: "Final",
    priority: "Must",
    version: "1.2",
  },
  {
    id: 2,
    name: "Mobile App Security Requirements",
    createdBy: "Jane Smith",
    createdOn: "2023-09-10",
    type: "Non-Functional",
    status: "Draft",
    priority: "Should",
    version: "0.8",
  },
  {
    id: 3,
    name: "Cloud Migration Plan",
    createdBy: "Mike Johnson",
    createdOn: "2023-09-05",
    type: "Functional",
    status: "Final",
    priority: "Must",
    version: "2.0",
  },
  {
    id: 4,
    name: "User Authentication Requirements",
    createdBy: "Sarah Williams",
    createdOn: "2023-08-28",
    type: "Functional",
    status: "Draft",
    priority: "Must",
    version: "0.5",
  },
  {
    id: 5,
    name: "Performance Criteria",
    createdBy: "David Brown",
    createdOn: "2023-08-20",
    type: "Non-Functional",
    status: "Final",
    priority: "Should",
    version: "1.1",
  },
  {
    id: 6,
    name: "Data Migration Requirements",
    createdBy: "Emily Davis",
    createdOn: "2023-08-15",
    type: "Functional",
    status: "Draft",
    priority: "Could",
    version: "0.3",
  },
  {
    id: 7,
    name: "API Integration Specifications",
    createdBy: "John Doe",
    createdOn: "2023-08-10",
    type: "Functional",
    status: "Final",
    priority: "Must",
    version: "1.4",
  },
  {
    id: 8,
    name: "Accessibility Requirements",
    createdBy: "Jane Smith",
    createdOn: "2023-08-05",
    type: "Non-Functional",
    status: "Draft",
    priority: "Should",
    version: "0.7",
  },
]

export default function DocumentsPage() {
  const searchParams = useSearchParams()
  const action = searchParams.get("action")

  const [documents, setDocuments] = useState(mockDocuments)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setStatusPriority] = useState("All")
  const [showUploadDialog, setShowUploadDialog] = useState(action === "upload")
  const [showGenerateDialog, setShowGenerateDialog] = useState(action === "generate")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "All" || doc.type === typeFilter
    const matchesStatus = statusFilter === "All" || doc.status === statusFilter
    const matchesPriority = priorityFilter === "All" || doc.priority === priorityFilter

    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  // Handle document selection
  const toggleDocumentSelection = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id))
    } else {
      setSelectedDocuments([...selectedDocuments, id])
    }
  }

  // Handle select all
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
    }
  }

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "Final":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "Must":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "Should":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "Could":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Won't":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  // Get type badge color
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Functional":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Non-Functional":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Document Management</h2>
          <p className="text-muted-foreground">Manage and organize your requirement documents.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" onClick={() => setShowGenerateDialog(true)}>
            <FileOutput className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as Word (.docx)</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF (.pdf)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="Functional">Functional</SelectItem>
                  <SelectItem value="Non-Functional">Non-Functional</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setStatusPriority}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="Must">Must Have</SelectItem>
                  <SelectItem value="Should">Should Have</SelectItem>
                  <SelectItem value="Could">Could Have</SelectItem>
                  <SelectItem value="Won't">Won't Have</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <CardDescription>{filteredDocuments.length} documents found</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Document Name
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => toggleDocumentSelection(doc.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.createdBy}</TableCell>
                    <TableCell>{doc.createdOn}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getTypeBadgeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(doc.status)}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityBadgeColor(doc.priority)}>
                        {doc.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>v{doc.version}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="mr-2 h-4 w-4" />
                            Version History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>Upload documents to extract requirements automatically.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6">
            <Upload className="mb-2 h-10 w-10 text-gray-400" />
            <p className="mb-1 text-sm font-medium">Drag and drop files here</p>
            <p className="mb-4 text-xs text-gray-500">Supports PDF, Word, Excel, HTML, .eml</p>
            <Button variant="outline">Browse Files</Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button type="button">Upload and Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Document</DialogTitle>
            <DialogDescription>Generate a formatted document from your requirements.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select defaultValue="requirements">
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requirements">Requirements Document</SelectItem>
                  <SelectItem value="specification">Technical Specification</SelectItem>
                  <SelectItem value="summary">Executive Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="docx">
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx">Word (.docx)</SelectItem>
                  <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Include</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-metadata" defaultChecked />
                  <label htmlFor="include-metadata" className="text-sm">
                    Document Metadata
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-history" defaultChecked />
                  <label htmlFor="include-history" className="text-sm">
                    Version History
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-issues" defaultChecked />
                  <label htmlFor="include-issues" className="text-sm">
                    AI-detected Issues
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button type="button">Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
