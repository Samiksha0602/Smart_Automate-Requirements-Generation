"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Clock, FileText, ListChecks, CheckSquare } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("all")

  // Mock data for the overview cards
  const overviewData = {
    totalDocuments: {
      value: 124,
      change: 12,
      period: "month",
    },
    totalRequirements: {
      value: 547,
      change: 8,
      period: "month",
    },
    activeProjects: {
      value: 12,
      change: 2,
      period: "month",
    },
    resolvedIssues: {
      value: 89,
      change: 15,
      period: "month",
    },
  }

  // Mock data for requirement types pie chart
  const requirementTypesData = [
    { name: "Functional", value: 42, color: "#2196F3" },
    { name: "Non-functional", value: 28, color: "#FF6384" },
    { name: "Technical", value: 15, color: "#36A2EB" },
    { name: "Design", value: 10, color: "#FFCE56" },
    { name: "Business", value: 5, color: "#4BC0C0" },
  ]

  // Mock data for priority distribution pie chart
  const priorityDistributionData = [
    { name: "Must", value: 35, color: "#FF6384" },
    { name: "Should", value: 25, color: "#36A2EB" },
    { name: "Could", value: 30, color: "#9966FF" },
    { name: "Won't", value: 10, color: "#C9CBCF" },
  ]

  // Mock data for status breakdown pie chart
  const statusBreakdownData = [
    { name: "Active", value: 45, color: "#4BC0C0" },
    { name: "Review", value: 30, color: "#FFCE56" },
    { name: "Draft", value: 15, color: "#C9CBCF" },
    { name: "Completed", value: 10, color: "#36A2EB" },
  ]

  // Mock data for project status
  const projectStatusData = [
    { name: "Project A", completion: 65, requirements: 20, issues: 3 },
    { name: "Project B", completion: 70, requirements: 25, issues: 4 },
    { name: "Project C", completion: 75, requirements: 30, issues: 5 },
    { name: "Project D", completion: 80, requirements: 35, issues: 6 },
  ]

  // Mock data for monthly activity
  const monthlyActivityData = [
    { name: "Jan", documents: 5, requirements: 12, issues: 3 },
    { name: "Feb", documents: 8, requirements: 20, issues: 5 },
    { name: "Mar", documents: 12, requirements: 30, issues: 7 },
    { name: "Apr", documents: 15, requirements: 42, issues: 8 },
    { name: "May", documents: 20, requirements: 55, issues: 10 },
    { name: "Jun", documents: 25, requirements: 70, issues: 12 },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Visualize and analyze your requirement engineering data</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {/* Total Documents Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                    <h2 className="text-3xl font-bold text-blue-600">{overviewData.totalDocuments.value}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+{overviewData.totalDocuments.change}%</span> from
                      last {overviewData.totalDocuments.period}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            {/* Total Requirements Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requirements</p>
                    <h2 className="text-3xl font-bold text-purple-600">{overviewData.totalRequirements.value}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+{overviewData.totalRequirements.change}%</span> from
                      last {overviewData.totalRequirements.period}
                    </p>
                  </div>
                  <ListChecks className="h-8 w-8 text-purple-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            {/* Active Projects Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <h2 className="text-3xl font-bold text-rose-600">{overviewData.activeProjects.value}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+{overviewData.activeProjects.change}</span> from
                      last {overviewData.activeProjects.period}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-rose-600 opacity-80" />
                </div>
              </CardContent>
            </Card>

            {/* Resolved Issues Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved Issues</p>
                    <h2 className="text-3xl font-bold text-green-600">{overviewData.resolvedIssues.value}</h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500 font-medium">+{overviewData.resolvedIssues.change}%</span> from
                      last {overviewData.resolvedIssues.period}
                    </p>
                  </div>
                  <CheckSquare className="h-8 w-8 text-green-600 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Requirement Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Requirement Types</CardTitle>
                <CardDescription>Distribution of requirement types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={requirementTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {requirementTypesData.map((entry, index) => (
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

            {/* Priority Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>MoSCoW priority breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priorityDistributionData.map((entry, index) => (
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

            {/* Status Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
                <CardDescription>Current status of requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusBreakdownData.map((entry, index) => (
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
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
              <CardDescription>Overview of project completion and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {projectStatusData.map((project) => (
                  <div key={project.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{project.name}</h3>
                      <span className="text-sm text-muted-foreground">{project.completion}% Complete</span>
                    </div>
                    <Progress value={project.completion} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{project.requirements} Requirements</span>
                      <span>{project.issues} Issues</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
              <CardDescription>Documents, requirements, and issues over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyActivityData}
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
                    <Line type="monotone" dataKey="documents" stroke="#36A2EB" activeDot={{ r: 8 }} name="documents" />
                    <Line type="monotone" dataKey="requirements" stroke="#FF6384" name="requirements" />
                    <Line type="monotone" dataKey="issues" stroke="#FFCE56" name="issues" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Requirements by Status</CardTitle>
              <CardDescription>Distribution of requirements by their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Active", value: 245 },
                      { name: "Review", value: 164 },
                      { name: "Draft", value: 82 },
                      { name: "Completed", value: 56 },
                    ]}
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
                    <Bar dataKey="value" name="Requirements" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
