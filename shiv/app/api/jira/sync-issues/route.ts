import { NextResponse } from "next/server";
import axios from "axios";

interface JiraIssue {
  id: string;
  type: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string;
}

interface SyncRequest {
  issues: JiraIssue[];
  jiraUrl: string;
  email: string;
  apiToken: string;
  projectKey: string;
}

const priorityMap = {
  "High": "1",
  "Medium": "2",
  "Low": "3"
};

const statusMap = {
  "To Do": "10000",
  "In Progress": "3",
  "Done": "10001"
};

export async function POST(request: Request) {
  try {
    const { issues, jiraUrl, email, apiToken, projectKey } = await request.json() as SyncRequest;

    if (!issues || !jiraUrl || !email || !apiToken || !projectKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      issues.map(async (issue) => {
        try {
          // Create issue in Jira
          const response = await axios.post(
            `${jiraUrl}/rest/api/2/issue`,
            {
              fields: {
                project: {
                  key: projectKey
                },
                summary: issue.summary,
                issuetype: {
                  name: issue.type
                },
                priority: {
                  id: priorityMap[issue.priority as keyof typeof priorityMap]
                },
                status: {
                  id: statusMap[issue.status as keyof typeof statusMap]
                },
                assignee: {
                  name: issue.assignee
                }
              }
            },
            {
              auth: {
                username: email,
                password: apiToken
              },
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          return {
            originalId: issue.id,
            jiraId: response.data.id,
            status: 'success'
          };
        } catch (error: any) {
          return {
            originalId: issue.id,
            error: error.response?.data?.message || 'Failed to create issue',
            status: 'error'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error: any) {
    console.error("Error syncing issues:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "An unexpected error occurred" },
      { status: error.response?.status || 500 }
    );
  }
} 