"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  FileText,
  Download,
  MessageSquare,
  Edit,
  Eye,
  AlertTriangle,
  FileSpreadsheet,
  Code,
  TestTube,
  Database,
  Share2,
  Copy,
  Printer,
  MoreHorizontal,
} from "lucide-react"

// Mock document data
const mockDocument = {
  id: "doc-123",
  name: "ERP System Requirements",
  version: "1.2",
  createdBy: "John Doe",
  createdOn: "2023-09-15",
  lastUpdated: "2023-09-20",
  status: "Final",
  summary:
    "This document outlines the requirements for the Enterprise Resource Planning (ERP) system. The system will integrate various business processes including finance, HR, inventory, and customer relationship management.",
  functionalRequirements: [
    {
      id: "FR-001",
      text: "The system shall allow users to create and manage customer profiles.",
      priority: "Must",
      status: "Clear",
    },
    {
      id: "FR-002",
      text: "The system shall provide a dashboard with key performance indicators.",
      priority: "Should",
      status: "Clear",
    },
    {
      id: "FR-003",
      text: "The system shall allow users to generate financial reports.",
      priority: "Must",
      status: "Clear",
    },
    {
      id: "FR-004",
      text: "The system shall integrate with existing CRM systems.",
      priority: "Could",
      status: "Unclear",
      issue: "Which CRM systems? Need specific integration points.",
    },
    {
      id: "FR-005",
      text: "The system shall provide inventory management capabilities.",
      priority: "Must",
      status: "Clear",
    },
  ],
  nonFunctionalRequirements: [
    {
      id: "NFR-001",
      text: "The system shall be available 99.9% of the time during business hours.",
      priority: "Must",
      status: "Clear",
      category: "Availability",
    },
    {
      id: "NFR-002",
      text: "The system shall respond to user queries within 2 seconds.",
      priority: "Should",
      status: "Clear",
      category: "Performance",
    },
    {
      id: "NFR-003",
      text: "The system shall encrypt all sensitive data using AES-256.",
      priority: "Must",
      status: "Clear",
      category: "Security",
    },
    {
      id: "NFR-004",
      text: "The system shall be accessible according to WCAG 2.1 AA standards.",
      priority: "Should",
      status: "Clear",
      category: "Accessibility",
    },
    {
      id: "NFR-005",
      text: "The system should be scalable to handle up to 10,000 concurrent users.",
      priority: "Could",
      status: "Unclear",
      issue: "Need to define performance expectations under load.",
      category: "Scalability",
    },
  ],
  missingInformation: [
    "Specific CRM systems for integration",
    "User role definitions and permissions",
    "Detailed reporting requirements",
    "Data retention policies",
  ],
  testCases: [
    {
      id: "TC-001",
      name: "Customer Profile Creation",
      steps: ["Navigate to Customer Management", "Click 'Add New Customer'", "Fill in required fields", "Click 'Save'"],
      expectedResult: "Customer profile is created and appears in the customer list",
      relatedRequirement: "FR-001",
    },
    {
      id: "TC-002",
      name: "Dashboard Loading Performance",
      steps: ["Log in to the system", "Navigate to Dashboard"],
      expectedResult: "Dashboard loads within 2 seconds",
      relatedRequirement: "NFR-002",
    },
  ],
  codeSnippets: [
    {
      id: "CS-001",
      language: "JavaScript",
      code: `// Example API endpoint for customer creation
async function createCustomer(customerData) {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}`,
      relatedRequirement: "FR-001",
    },
  ],
  dataLineage: {
    entities: ["Customer", "Order", "Product", "Invoice", "Payment"],
    relationships: [
      { from: "Customer", to: "Order", type: "places" },
      { from: "Order", to: "Product", type: "contains" },
      { from: "Order", to: "Invoice", type: "generates" },
      { from: "Invoice", to: "Payment", type: "receives" },
    ],
  },
}

// Mock comments
const mockComments = [
  {
    id: 1,
    user: "Jane Smith",
    date: "2023-09-18",
    text: "We need to clarify which CRM systems need to be integrated.",
    requirementId: "FR-004",
  },
  {
    id: 2,
    user: "Mike Johnson",
    date: "2023-09-19",
    text: "Let's define the specific performance metrics for scalability.",
    requirementId: "NFR-005",
  },
]

export default function DocumentViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"view" | "comment" | "edit">("view")
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [activeComment, setActiveComment] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")

  // Get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "Must":
        return "bg-red-100 text-red-800"
      case "Should":
        return "bg-amber-100 text-amber-800"
      case "Could":
        return "bg-green-100 text-green-800"
      case "Won't":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  // Get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Security":
        return "bg-red-50 text-red-700"
      case "Performance":
        return "bg-blue-50 text-blue-700"
      case "Availability":
        return "bg-green-50 text-green-700"
      case "Scalability":
        return "bg-purple-50 text-purple-700"
      case "Accessibility":
        return "bg-amber-50 text-amber-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  // Handle comment submission
  const handleCommentSubmit = (requirementId: string) => {
    console.log(`Comment submitted for ${requirementId}: ${commentText}`)
    setActiveComment(null)
    setCommentText("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{mockDocument.name}</h2>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">Version {mockDocument.version}</p>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {mockDocument.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tabs value={viewMode} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="view" onClick={() => setViewMode("view")}>
                <Eye className="mr-1 h-4 w-4" />
                View
              </TabsTrigger>
              <TabsTrigger value="comment" onClick={() => setViewMode("comment")}>
                <MessageSquare className="mr-1 h-4 w-4" />
                Comment
              </TabsTrigger>
              <TabsTrigger value="edit" onClick={() => setViewMode("edit")}>
                <Edit className="mr-1 h-4 w-4" />
                Edit
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Export as Word (.docx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowExportDialog(true)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export User Stories (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Summary</CardTitle>
          <CardDescription>
            Created by {mockDocument.createdBy} on {mockDocument.createdOn} • Last updated {mockDocument.lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "edit" ? (
            <Textarea defaultValue={mockDocument.summary} className="min-h-[100px]" />
          ) : (
            <p>{mockDocument.summary}</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Functional Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Functional Requirements</CardTitle>
            <CardDescription>{mockDocument.functionalRequirements.length} requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {mockDocument.functionalRequirements.map((req) => (
                  <div key={req.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {req.id}
                      </Badge>
                      <Badge variant="outline" className={getPriorityBadgeColor(req.priority)}>
                        {req.priority}
                      </Badge>
                    </div>

                    {viewMode === "edit" ? (
                      <Textarea defaultValue={req.text} className="mb-2 min-h-[80px]" />
                    ) : (
                      <p className="text-sm">{req.text}</p>
                    )}

                    {req.status === "Unclear" && req.issue && (
                      <div className="mt-2 rounded-md bg-amber-50 p-2">
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Issue:</span>
                        </div>
                        <p className="text-xs text-amber-700">{req.issue}</p>
                      </div>
                    )}

                    {viewMode === "comment" && (
                      <div className="mt-3">
                        {mockComments
                          .filter((comment) => comment.requirementId === req.id)
                          .map((comment) => (
                            <div key={comment.id} className="mb-2 rounded-md bg-gray-50 p-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              <p className="text-gray-700">{comment.text}</p>
                            </div>
                          ))}

                        {activeComment === req.id ? (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              placeholder="Add your comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setActiveComment(null)}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => handleCommentSubmit(req.id)}>
                                Submit
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setActiveComment(req.id)}>
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Add Comment
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Non-Functional Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Non-Functional Requirements</CardTitle>
            <CardDescription>{mockDocument.nonFunctionalRequirements.length} requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {mockDocument.nonFunctionalRequirements.map((req) => (
                  <div key={req.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {req.id}
                        </Badge>
                        <Badge variant="outline" className={getCategoryBadgeColor(req.category)}>
                          {req.category}
                        </Badge>
                      </div>
                      <Badge variant="outline" className={getPriorityBadgeColor(req.priority)}>
                        {req.priority}
                      </Badge>
                    </div>

                    {viewMode === "edit" ? (
                      <Textarea defaultValue={req.text} className="mb-2 min-h-[80px]" />
                    ) : (
                      <p className="text-sm">{req.text}</p>
                    )}

                    {req.status === "Unclear" && req.issue && (
                      <div className="mt-2 rounded-md bg-amber-50 p-2">
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-xs font-medium">Issue:</span>
                        </div>
                        <p className="text-xs text-amber-700">{req.issue}</p>
                      </div>
                    )}

                    {viewMode === "comment" && (
                      <div className="mt-3">
                        {mockComments
                          .filter((comment) => comment.requirementId === req.id)
                          .map((comment) => (
                            <div key={comment.id} className="mb-2 rounded-md bg-gray-50 p-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{comment.user}</span>
                                <span className="text-xs text-gray-500">{comment.date}</span>
                              </div>
                              <p className="text-gray-700">{comment.text}</p>
                            </div>
                          ))}

                        {activeComment === req.id ? (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              placeholder="Add your comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setActiveComment(null)}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => handleCommentSubmit(req.id)}>
                                Submit
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="mt-2" onClick={() => setActiveComment(req.id)}>
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Add Comment
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Missing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Missing Information</CardTitle>
            <CardDescription>Information that needs to be clarified</CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "edit" ? (
              <div className="space-y-2">
                {mockDocument.missingInformation.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input defaultValue={item} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-2">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Add Missing Information
                </Button>
              </div>
            ) : (
              <ul className="ml-6 list-disc space-y-2">
                {mockDocument.missingInformation.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* MoSCoW Priorities */}
        <Card>
          <CardHeader>
            <CardTitle>MoSCoW Priorities</CardTitle>
            <CardDescription>Requirement prioritization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">Must Have</Badge>
                <span className="text-sm">
                  {
                    [...mockDocument.functionalRequirements, ...mockDocument.nonFunctionalRequirements].filter(
                      (req) => req.priority === "Must",
                    ).length
                  }{" "}
                  requirements
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-100 text-amber-800">Should Have</Badge>
                <span className="text-sm">
                  {
                    [...mockDocument.functionalRequirements, ...mockDocument.nonFunctionalRequirements].filter(
                      (req) => req.priority === "Should",
                    ).length
                  }{" "}
                  requirements
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Could Have</Badge>
                <span className="text-sm">
                  {
                    [...mockDocument.functionalRequirements, ...mockDocument.nonFunctionalRequirements].filter(
                      (req) => req.priority === "Could",
                    ).length
                  }{" "}
                  requirements
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-800">Won't Have</Badge>
                <span className="text-sm">
                  {
                    [...mockDocument.functionalRequirements, ...mockDocument.nonFunctionalRequirements].filter(
                      (req) => req.priority === "Won't",
                    ).length
                  }{" "}
                  requirements
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="testCases" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="testCases" className="flex-1">
            <TestTube className="mr-1 h-4 w-4" />
            Test Cases
          </TabsTrigger>
          <TabsTrigger value="codeSnippets" className="flex-1">
            <Code className="mr-1 h-4 w-4" />
            Code Snippets
          </TabsTrigger>
          <TabsTrigger value="dataLineage" className="flex-1">
            <Database className="mr-1 h-4 w-4" />
            Data Lineage
          </TabsTrigger>
        </TabsList>
        <TabsContent value="testCases" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Cases</CardTitle>
              <CardDescription>AI-generated test cases based on requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocument.testCases.map((testCase) => (
                  <div key={testCase.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {testCase.id}
                        </Badge>
                        <h3 className="font-medium">{testCase.name}</h3>
                      </div>
                      <Badge variant="outline">Related to {testCase.relatedRequirement}</Badge>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Steps:</h4>
                        <ol className="ml-5 list-decimal">
                          {testCase.steps.map((step, index) => (
                            <li key={index} className="text-sm">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500">Expected Result:</h4>
                        <p className="text-sm">{testCase.expectedResult}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="codeSnippets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Snippets</CardTitle>
              <CardDescription>AI-generated code examples based on requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocument.codeSnippets.map((snippet) => (
                  <div key={snippet.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                          {snippet.language}
                        </Badge>
                        <Badge variant="outline">Related to {snippet.relatedRequirement}</Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="dataLineage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Lineage</CardTitle>
              <CardDescription>AI-generated data relationships based on requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Entities</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {mockDocument.dataLineage.entities.map((entity, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                      {entity}
                    </Badge>
                  ))}
                </div>
                <h3 className="mb-2 font-medium">Relationships</h3>
                <div className="space-y-2">
                  {mockDocument.dataLineage.relationships.map((rel, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {rel.from}
                      </Badge>
                      <span className="text-gray-500">{rel.type}</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {rel.to}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Document</DialogTitle>
            <DialogDescription>Choose export options for your document.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Include Sections</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-summary" defaultChecked />
                  <label htmlFor="include-summary" className="text-sm">
                    Summary
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-functional" defaultChecked />
                  <label htmlFor="include-functional" className="text-sm">
                    Functional Requirements
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-nonfunctional" defaultChecked />
                  <label htmlFor="include-nonfunctional" className="text-sm">
                    Non-Functional Requirements
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-missing" defaultChecked />
                  <label htmlFor="include-missing" className="text-sm">
                    Missing Information
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-testcases" defaultChecked />
                  <label htmlFor="include-testcases" className="text-sm">
                    Test Cases
                  </label>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Format Options</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-metadata" defaultChecked />
                  <label htmlFor="include-metadata" className="text-sm">
                    Include Metadata
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-comments" defaultChecked />
                  <label htmlFor="include-comments" className="text-sm">
                    Include Comments
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-issues" defaultChecked />
                  <label htmlFor="include-issues" className="text-sm">
                    Highlight Issues
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowExportDialog(false)}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
