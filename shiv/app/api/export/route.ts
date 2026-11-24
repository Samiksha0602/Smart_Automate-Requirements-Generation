import { NextResponse } from 'next/server';
import * as docx from 'docx';
import { Requirement } from '@/types/requirements';

export async function POST(req: Request) {
  try {
    const requirements: Requirement[] = await req.json();

    // Create a new document
    const doc = new docx.Document({
      sections: [{
        properties: {},
        children: [
          new docx.Paragraph({
            text: "Requirements Document",
            heading: docx.HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          
          // Functional Requirements Section
          new docx.Paragraph({
            text: "Functional Requirements",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          ...requirements
            .filter(req => req.type === "Functional")
            .map(req => [
              new docx.Paragraph({
                bullet: { level: 0 },
                text: req.text,
                spacing: { before: 100, after: 100 }
              }),
              ...(req.issue ? [
                new docx.Paragraph({
                  text: `Issue: ${req.issue}`,
                  spacing: { before: 100, after: 100 },
                  color: "red"
                })
              ] : [])
            ]).flat(),

          // Non-Functional Requirements Section
          new docx.Paragraph({
            text: "Non-Functional Requirements",
            heading: docx.HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),
          ...requirements
            .filter(req => req.type === "Non-Functional")
            .map(req => [
              new docx.Paragraph({
                bullet: { level: 0 },
                text: req.text,
                spacing: { before: 100, after: 100 }
              }),
              ...(req.issue ? [
                new docx.Paragraph({
                  text: `Issue: ${req.issue}`,
                  spacing: { before: 100, after: 100 },
                  color: "red"
                })
              ] : [])
            ]).flat(),
        ],
      }],
    });

    // Generate the document as a buffer
    const buffer = await docx.Packer.toBuffer(doc);

    // Create response with the document
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=requirements.docx',
      },
    });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
} 