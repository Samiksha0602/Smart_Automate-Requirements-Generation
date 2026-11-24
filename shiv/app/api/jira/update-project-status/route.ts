import { NextResponse } from "next/server";
import axios from "axios";

interface UpdateProjectRequest {
  projectKey: string;
  isActive: boolean;
  jiraUrl: string;
  email: string;
  apiToken: string;
}

export async function POST(request: Request) {
  try {
    const { projectKey, isActive, jiraUrl, email, apiToken } = await request.json() as UpdateProjectRequest;

    if (!projectKey || !jiraUrl || !email || !apiToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Make request to Jira API to update project status
    const response = await axios.put(
      `${jiraUrl}/rest/api/2/project/${projectKey}`,
      {
        // Update the project properties based on isActive
        archived: !isActive, // Archive project if not active
      },
      {
        auth: {
          username: email,
          password: apiToken,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: `Project ${projectKey} ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    }

    return NextResponse.json(
      { error: "Failed to update project status" },
      { status: response.status }
    );
  } catch (error: any) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "An unexpected error occurred" },
      { status: error.response?.status || 500 }
    );
  }
} 