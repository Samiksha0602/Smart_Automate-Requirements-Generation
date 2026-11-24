"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  LinkIcon,
  AlertCircle,
  ArrowRightLeft,
  Settings,
  Clock,
  ExternalLink,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Jira API configuration
const JIRA_DOMAIN = "https://your-domain.atlassian.net"

interface Project {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
}

export default function JiraIntegrationPage() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    apiToken: "",
    jiraUrl: "",
  })
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", key: "REQ", name: "Requirement Management", isActive: true },
    { id: "2", key: "DEV", name: "Development", isActive: true },
    { id: "3", key: "TEST", name: "Quality Assurance", isActive: true },
    { id: "4", key: "OPS", name: "Operations", isActive: true },
    { id: "5", key: "MKT", name: "Marketing", isActive: false },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const verifyJiraCredentials = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/jira/verify-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          apiToken: formData.apiToken,
          jiraUrl: formData.jiraUrl,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setConnected(true)
        // Store credentials in localStorage for future use
        localStorage.setItem("jiraCredentials", JSON.stringify({
          email: formData.email,
          apiToken: formData.apiToken,
          jiraUrl: formData.jiraUrl,
        }))
      } else {
        setError(data.message || "Failed to authenticate with Jira")
      }
    } catch (err) {
      setError("An error occurred while verifying credentials")
      console.error("Error verifying Jira credentials:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setConnected(false)
      setLoading(false)
      // Clear stored credentials
      localStorage.removeItem("jiraCredentials")
    }, 1000)
  }

  const handleProjectToggle = useCallback(async (projectKey: string) => {
    try {
      const project = projects.find(p => p.key === projectKey);
      if (!project) return;

      const newStatus = !project.isActive;

      // Make API call to Jira to update project status
      const response = await fetch("/api/jira/update-project-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectKey,
          isActive: newStatus,
          jiraUrl: formData.jiraUrl,
          email: formData.email,
          apiToken: formData.apiToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update project status");
      }

      // Update local state
      setProjects(prev =>
        prev.map(p =>
          p.key === projectKey ? { ...p, isActive: newStatus } : p
        )
      );
    } catch (error) {
      console.error("Error updating project status:", error);
      // You might want to show an error toast/alert here
    }
  }, [projects, formData]);

  const syncIssuesWithJira = async (projectKey: string) => {
    try {
      const response = await fetch("/api/jira/sync-issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issues: jiraIssues,
          jiraUrl: formData.jiraUrl,
          email: formData.email,
          apiToken: formData.apiToken,
          projectKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync issues");
      }

      const data = await response.json();
      console.log("Sync results:", data.results);
      
      // You might want to show a success message here
      alert("Issues successfully synced with Jira!");
    } catch (error) {
      console.error("Error syncing issues:", error);
      // Show error message to user
      alert("Failed to sync issues with Jira. Please try again.");
    }
  };

  // Mock data for Jira issues
  const jiraIssues = [
    {
      id: "SCRUM-1",
      type: "Task",
      summary: "Mayur fix the routing errors are coming",
      status: "To Do",
      priority: "High",
      assignee: "Mayur",
    },
    {
      id: "SCRUM-2",
      type: "Story",
      summary: "As a new user, I want to be able to register for an account",
      status: "To Do",
      priority: "Medium",
      assignee: "Unassigned",
    },
    {
      id: "SCRUM-3",
      type: "Story",
      summary: "As a user, I want to be able to reset my password via email",
      status: "In Progress",
      priority: "High",
      assignee: "Unassigned",
    },
    {
      id: "SCRUM-4",
      type: "Story",
      summary: "As a user, I want to customize my notification preferences",
      status: "To Do",
      priority: "Medium",
      assignee: "Unassigned",
    },
    {
      id: "SCRUM-5",
      type: "Task",
      summary: "generating a risk profile summary for corporate client",
      status: "Done",
      priority: "High",
      assignee: "Unassigned",
    },
    {
      id: "SCRUM-6",
      type: "Task",
      summary: "validating beneficiary details with high value SWIFT transfer",
      status: "Done",
      priority: "High",
      assignee: "Unassigned",
    },
    {
      id: "SCRUM-7",
      type: "Task",
      summary: "scheduling periodic account for dormant account",
      status: "Done",
      priority: "Medium",
      assignee: "Unassigned",
    },
  ]

  // Mock data for sync history
  const syncHistory = [
    { id: 1, date: "2023-04-26 14:32:45", status: "Success", items: 24, duration: "45s" },
    { id: 2, date: "2023-04-25 10:15:22", status: "Success", items: 18, duration: "38s" },
    { id: 3, date: "2023-04-24 16:45:10", status: "Failed", items: 0, duration: "12s", error: "API timeout" },
    { id: 4, date: "2023-04-23 09:30:05", status: "Success", items: 32, duration: "56s" },
    { id: 5, date: "2023-04-22 11:20:18", status: "Success", items: 15, duration: "30s" },
  ]

  // Mock data for issue status chart
  const issueStatusData = [
    { name: "To Do", value: 12, color: "#36A2EB" },
    { name: "In Progress", value: 8, color: "#FFCE56" },
    { name: "In Review", value: 5, color: "#9966FF" },
    { name: "Done", value: 18, color: "#4BC0C0" },
  ]

  // Mock data for issue trend chart
  const issueTrendData = [
    { name: "Week 1", created: 8, resolved: 5 },
    { name: "Week 2", created: 10, resolved: 7 },
    { name: "Week 3", created: 12, resolved: 9 },
    { name: "Week 4", created: 15, resolved: 12 },
    { name: "Week 5", created: 9, resolved: 14 },
    { name: "Week 6", created: 7, resolved: 8 },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jira Integration</h1>
          <p className="text-muted-foreground">Connect and sync your Jira projects with ReqAssist</p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" />
              Disconnected
            </Badge>
          )}
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="sync">Sync History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {!connected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect to Jira</CardTitle>
                <CardDescription>Link your Jira account to sync issues, requirements, and project data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="jira-url">Jira URL</Label>
                  <Input
                    id="jira-url"
                    name="jiraUrl"
                    placeholder="https://your-domain.atlassian.net"
                    value={formData.jiraUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Atlassian account email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    name="apiToken"
                    type="password"
                    placeholder="Your Jira API token"
                    value={formData.apiToken}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can generate an API token in your Atlassian account settings.{" "}
                    <a
                      href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more
                    </a>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={verifyJiraCredentials} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Connect to Jira
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Details</CardTitle>
                    <CardDescription>Your current Jira connection information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Instance URL:</span>
                        <span className="text-sm">{formData.jiraUrl}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Account:</span>
                        <span className="text-sm">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Connected Projects:</span>
                        <span className="text-sm">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Last Sync:</span>
                        <span className="text-sm">April 26, 2023 (14:32)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Sync Status:</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Up to date
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleDisconnect} disabled={loading}>
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Disconnecting...
                        </>
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                    <Button>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Jira Projects</CardTitle>
                    <CardDescription>Projects available for integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`project-${project.key.toLowerCase()}`}
                              checked={project.isActive}
                              onCheckedChange={() => handleProjectToggle(project.key)}
                            />
                            <Label htmlFor={`project-${project.key.toLowerCase()}`}>
                              {project.key} - {project.name}
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.isActive && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => syncIssuesWithJira(project.key)}
                                className="mr-2"
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Sync Issues
                              </Button>
                            )}
                            <Badge variant={project.isActive ? "default" : "outline"}>
                              {project.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(formData.jiraUrl, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Jira
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Issue Status Distribution</CardTitle>
                    <CardDescription>Current status of Jira issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={issueStatusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {issueStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Issue Trend</CardTitle>
                    <CardDescription>Created vs. resolved issues over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={issueTrendData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="created" stroke="#FF6384" name="Created" />
                          <Line type="monotone" dataKey="resolved" stroke="#4BC0C0" name="Resolved" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Jira Issues</CardTitle>
                <CardDescription>View and manage synced issues from Jira</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[300px]">Summary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jiraIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.id}</TableCell>
                      <TableCell>{issue.type}</TableCell>
                      <TableCell>{issue.summary}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            issue.status === "Done"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : issue.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            issue.priority === "High"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : issue.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{issue.assignee}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`${formData.jiraUrl}/browse/${issue.id}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">Open in Jira</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Showing 5 of 43 issues</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>Configure how ReqAssist fields map to Jira fields</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">ReqAssist Field</TableHead>
                    <TableHead className="w-[250px]">Jira Field</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Requirement ID</TableCell>
                    <TableCell>Issue Key</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Requirement Title</TableCell>
                    <TableCell>Summary</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Requirement Description</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Priority</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Assignee</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Requirement Type</TableCell>
                    <TableCell>Issue Type</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                        Bidirectional
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Add Field Mapping
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sync History</CardTitle>
                <CardDescription>Recent synchronization activities between ReqAssist and Jira</CardDescription>
              </div>
              <Button>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items Synced</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncHistory.map((sync) => (
                    <TableRow key={sync.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {sync.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            sync.status === "Success"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {sync.status === "Success" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                          )}
                          {sync.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{sync.items}</TableCell>
                      <TableCell>{sync.duration}</TableCell>
                      <TableCell>
                        {sync.status === "Failed" ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {sync.error}
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">Showing last 5 sync operations</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>Configure your Jira integration preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sync Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-sync">Automatic Synchronization</Label>
                    <p className="text-sm text-muted-foreground">Automatically sync changes between systems</p>
                  </div>
                  <Switch id="auto-sync" checked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sync-frequency">Sync Frequency</Label>
                    <p className="text-sm text-muted-foreground">How often to check for changes</p>
                  </div>
                  <Select defaultValue="15">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Every 5 minutes</SelectItem>
                      <SelectItem value="15">Every 15 minutes</SelectItem>
                      <SelectItem value="30">Every 30 minutes</SelectItem>
                      <SelectItem value="60">Every hour</SelectItem>
                      <SelectItem value="daily">Once a day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Settings</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sync-notifications">Sync Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about sync status</p>
                  </div>
                  <Switch id="sync-notifications" checked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="error-notifications">Error Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications about sync errors</p>
                  </div>
                  <Switch id="error-notifications" checked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Conflict Resolution</h3>
                <div className="space-y-2">
                  <Label htmlFor="conflict-strategy">Conflict Resolution Strategy</Label>
                  <Select defaultValue="jira">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jira">Jira is source of truth</SelectItem>
                      <SelectItem value="reqassist">ReqAssist is source of truth</SelectItem>
                      <SelectItem value="newest">Newest change wins</SelectItem>
                      <SelectItem value="manual">Manual resolution</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Determines how conflicts between Jira and ReqAssist are resolved
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Advanced Settings</AlertTitle>
            <AlertDescription>
              Additional configuration options are available through the Jira API. Contact your administrator for more
              information.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
