"use client"

import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  FileText,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Upload,
  FileOutput,
  History,
  AlertTriangle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useOnboarding } from "@/components/onboarding-provider";

export default function Dashboard() {
  const { user } = useOnboarding();
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
        <h2 className="text-2xl font-bold tracking-tight">
            Welcome, {user?.fullName || "User"}
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your requirement engineering projects.
          </p>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/new-session">
          <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Start New Requirement Session</CardTitle>
              <PlusCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Create a new requirement gathering session with AI assistance
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/documents?action=upload">
          <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upload Files</CardTitle>
              <Upload className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Upload existing documents to extract requirements</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/documents?action=generate">
          <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generate Document</CardTitle>
              <FileOutput className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Generate formatted requirement documents from your data</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/documents">
          <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Review Past Projects</CardTitle>
              <History className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Access and review your previous requirement projects</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Insight Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span>Functional: 28</span>
                  <span>Non-Functional: 14</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-blue-600" style={{ width: "67%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version Count</CardTitle>
            <History className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span>This Week: 12</span>
                  <span>Last Month: 75</span>
                </div>
                <Progress value={15} className="mt-1 h-2 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-Detected Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-xs">
                  <span>Critical: 3</span>
                  <span>Warning: 15</span>
                </div>
                <div className="mt-1 grid grid-cols-2 gap-1">
                  <div className="h-2 rounded-full bg-red-500" />
                  <div className="h-2 rounded-full bg-amber-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent requirement engineering activities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "ERP System Requirements Updated",
                    time: "2 hours ago",
                    status: "Updated",
                    icon: CheckCircle2,
                    iconColor: "text-green-500",
                    description: "Added 5 new functional requirements",
                  },
                  {
                    title: "Mobile App Requirements Review",
                    time: "Yesterday",
                    status: "In Progress",
                    icon: Clock3,
                    iconColor: "text-amber-500",
                    description: "AI detected 3 ambiguous requirements",
                  },
                  {
                    title: "Cloud Migration Requirements",
                    time: "2 days ago",
                    status: "Needs Attention",
                    icon: AlertCircle,
                    iconColor: "text-red-500",
                    description: "Missing non-functional requirements",
                  },
                  {
                    title: "CRM Integration Requirements",
                    time: "3 days ago",
                    status: "Completed",
                    icon: CheckCircle2,
                    iconColor: "text-green-500",
                    description: "All requirements verified and prioritized",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full p-1 ${item.iconColor} bg-opacity-10`}>
                        <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{item.status}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Your current active requirement engineering projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "ERP System Modernization",
                    progress: "75%",
                    requirements: 42,
                    dueDate: "Oct 15, 2023",
                  },
                  {
                    title: "Mobile Banking App",
                    progress: "30%",
                    requirements: 28,
                    dueDate: "Nov 20, 2023",
                  },
                  {
                    title: "Cloud Infrastructure Migration",
                    progress: "60%",
                    requirements: 35,
                    dueDate: "Dec 5, 2023",
                  },
                  {
                    title: "Customer Portal Redesign",
                    progress: "15%",
                    requirements: 18,
                    dueDate: "Jan 10, 2024",
                  },
                ].map((project, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{project.title}</h3>
                      <span className="text-sm font-medium text-blue-600">{project.progress}</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: project.progress }} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span>{project.requirements} Requirements</span>
                      <span>Due: {project.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Requirement engineering metrics and analytics.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-16 w-16 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">Analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
