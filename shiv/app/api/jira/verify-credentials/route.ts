import { NextResponse } from "next/server"
import axios, { AxiosError } from "axios"

interface JiraCredentials {
  email: string;
  apiToken: string;
  jiraUrl: string;
}

export async function POST(request: Request) {
  try {
    const { email, apiToken, jiraUrl } = await request.json() as JiraCredentials

    if (!email || !apiToken || !jiraUrl) {
      return NextResponse.json(
        { error: "Missing required credentials" },
        { status: 400 }
      )
    }

    // Verify credentials by making a request to Jira's REST API
    const response = await axios.get(`${jiraUrl}/rest/api/2/myself`, {
      auth: {
        username: email,
        password: apiToken,
      },
    })

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: "Credentials verified successfully",
        user: response.data,
      })
    }

    return NextResponse.json(
      { error: "Failed to verify credentials" },
      { status: response.status }
    )
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data?.message || "Failed to verify credentials" },
        { status: error.response?.status || 500 }
      )
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 