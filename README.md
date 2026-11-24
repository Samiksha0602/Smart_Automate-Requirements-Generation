# Smart Automate – AI-Powered Requirements Generation

An AI-powered requirements engineering platform that transforms unstructured project information into structured, categorized, and prioritized software requirements using Large Language Models (LLMs).

## Overview

Gathering and documenting software requirements from multiple sources is often time-consuming and prone to ambiguity, duplication, and inconsistencies.

**Smart Automate** aims to simplify this process by using AI-assisted requirement extraction and consolidation. It accepts information in different formats, processes the content, and converts it into structured functional and non-functional requirements.

The platform combines a Next.js web interface with a Python-based AI processing pipeline powered by Google's Gemini API.

## Key Features

- **Multi-format Input:** Process text, Word documents, PDFs, images, and audio recordings.
- **AI-Powered Requirement Extraction:** Convert unstructured information into structured software requirements.
- **Visual Requirement Analysis:** Interpret UI mockups, flowcharts, diagrams, forms, and handwritten notes.
- **Audio-to-Requirements Processing:** Transcribe audio recordings and extract requirements from conversations.
- **Requirement Classification:** Separate functional and non-functional requirements.
- **MoSCoW Prioritization:** Categorize requirements into Must Have, Should Have, Could Have, and Won't Have.
- **Requirement Consolidation:** Identify overlapping requirements and eliminate duplicates across multiple sources.
- **Document Generation:** Generate downloadable, structured Word documents containing consolidated requirements.
- **Jira Integration:** Includes API endpoints for synchronizing issues and updating project status.
- **Requirement Management Interface:** Provides dashboard, requirement sessions, document management, analytics, and history interfaces.

## How LLMs Are Used

Google Gemini is the primary LLM used in the Python-based requirement engineering pipeline.

Rather than relying entirely on predefined keywords or templates, the LLM interprets the meaning and context of the provided information to generate structured requirements.

### 1. Text-to-Requirement Generation

Users can provide rough notes, meeting summaries, project descriptions, or existing requirement documents.

Gemini processes the extracted text and converts it into structured JSON containing:

- Requirement ID
- Requirement description
- Additional notes, where applicable

The model is prompted to act as a software analyst and rewrite informal statements into clear software requirements.

### 2. Visual Understanding Using Multimodal LLMs

The system uses Gemini's multimodal capabilities to analyze visual inputs.

Images containing UI layouts, wireframes, flowcharts, forms, diagrams, and handwritten notes are supplied to the model along with an analysis prompt.

The LLM:
- Interprets the visual information.
- Identifies relevant system features and behaviors.
- Converts visual observations into clear textual descriptions.
- Structures the resulting requirements into JSON.

The requirements are further processed with MoSCoW prioritization.

### 3. Audio-Based Requirement Extraction

Audio recordings are processed through a speech-to-text pipeline.

The workflow consists of:

1. Converting audio files into WAV format using Pydub.
2. Transcribing the audio using the Google Speech Recognition service through the SpeechRecognition library.
3. Sending the transcribed text to Gemini.
4. Converting the conversation into structured requirement statements.

This makes it possible to derive requirements from discussions and recorded stakeholder conversations.

### 4. Requirement Consolidation and Deduplication

When requirements are extracted from multiple sources, they may contain overlapping or repetitive information.

The Master Agent uses Gemini to:

- Analyze requirements collected from different inputs.
- Identify semantically similar or duplicate requirements.
- Consolidate overlapping statements.
- Classify requirements as functional or non-functional.
- Assign MoSCoW priorities.
- Generate a unified structured JSON output.

The consolidated output follows two main categories:

- Functional Requirements (FR)
- Non-Functional Requirements (NFR)

### 5. Structured Output Generation

The LLM is instructed to return structured JSON instead of unrestricted natural-language responses.

This allows the application to process the generated requirements programmatically and prepare a consolidated requirements document.

### LLM Processing Workflow

```text
        User Input
             |
     +-------+-------+
     |       |       |
    Text   Images   Audio
     |       |       |
     |    Gemini   Speech-to-Text
     |   Vision       |
     |       |      Gemini
     |       |       |
     +-------+-------+
             |
      Structured JSON
             |
      Master Agent
             |
    Deduplication and
    Requirement Classification
             |
       MoSCoW Priority
             |
    Consolidated Requirements
             |
       Word Document
```

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, Radix UI |
| Backend | Next.js API Routes, Python |
| Database | PostgreSQL |
| ORM | Prisma |
| LLM | Google Gemini API |
| Image Processing | OpenCV, Pillow |
| OCR | Tesseract, Pytesseract |
| Audio Processing | Pydub, SpeechRecognition |
| Document Processing | python-docx, pdf2image |
| Integration | Jira REST API |
| Package Management | pnpm, pip |

## System Architecture

The application consists of three major layers:

**1. Frontend Layer**
- Interactive dashboard.
- Requirement creation and input interface.
- File upload functionality.
- AI assistant interface.
- Requirement review and export interface.

**2. Backend Layer**
- Next.js API routes for handling application requests.
- Python-based processing modules for text, visual, and audio inputs.
- Master Agent for requirement consolidation.
- Document generation functionality.
- Jira API integration.

**3. AI Processing Layer**
- Gemini-powered text understanding.
- Multimodal image interpretation.
- Audio transcription and requirement extraction.
- Requirement deduplication and classification.
- MoSCoW prioritization.

## Project Structure

```text
shiv/
│
├── agent/
│   ├── app.py
│   ├── audio_finalfinal.py
│   ├── export_api.py
│   ├── handlertwo.py
│   ├── layout_finalfinal.py
│   ├── master_agent.py
│   ├── text_finalfinal.py
│   ├── requirements.txt
│   ├── setup.sh
│   └── setup.bat
│
├── app/
│   ├── analytics/
│   ├── api/
│   ├── documents/
│   ├── history/
│   ├── jira/
│   ├── new-session/
│   ├── onboarding/
│   └── settings/
│
├── components/
├── hooks/
├── lib/
├── prisma/
│   └── schema.prisma
│
├── public/
├── styles/
├── types/
│
├── package.json
├── pnpm-lock.yaml
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Installation and Setup

### Prerequisites

- Node.js
- pnpm
- Python 3.8+
- PostgreSQL
- Tesseract OCR
- Poppler (for PDF image conversion)
- Google Gemini API key

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_NAME>/shiv
```

### 2. Install Frontend Dependencies

```bash
pnpm install
```

### 3. Configure the Database

Create a PostgreSQL database and configure the database connection.

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

Generate the Prisma client and apply the schema:

```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Set Up the Python AI Agent

Navigate to the agent directory:

```bash
cd agent
```

For macOS/Linux:

```bash
chmod +x setup.sh
./setup.sh
```

For Windows:

```bash
setup.bat
```

### 5. Configure Gemini API

Create a `.env` file inside the `agent` directory:

```env
GEMINI_API=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro-latest
```

Use a valid Gemini model available to your API account.

### 6. Run the Application

Start the Next.js application from the `shiv` directory:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Running the Python Agent Separately

The Python agent also provides a Streamlit interface.

From the `agent` directory, activate the virtual environment and run:

```bash
source venv/bin/activate
streamlit run app.py
```

On Windows, activate the virtual environment using:

```bash
venv\Scripts\activate
```

Then run:

```bash
streamlit run app.py
```

## Supported Input Formats

| Input Type | Supported Formats | Processing |
|---|---|---|
| Text documents | TXT, DOCX | Text extraction and Gemini |
| PDFs | PDF | OCR or visual analysis |
| Images | PNG, JPG, JPEG | OCR or Gemini visual analysis |
| Audio | WAV, MP3, M4A, OPUS | Speech-to-text and Gemini |

## Expected Output

The system produces structured requirements containing information such as:

```json
{
  "functional_requirements": [
    {
      "id": "FR-1",
      "description": "The system must allow users to register and authenticate.",
      "priority": "must",
      "type": "functional"
    }
  ],
  "non_functional_requirements": [
    {
      "id": "NFR-1",
      "description": "The system should maintain reliable response times.",
      "priority": "should",
      "type": "non-functional"
    }
  ]
}
```

The final consolidated requirements can be exported into a formatted Word document.

## Future Enhancements

- Improved requirement ambiguity and conflict detection.
- Automated requirement quality assessment.
- Advanced traceability between stakeholder inputs and generated requirements.
- Enhanced requirement version control.
- More comprehensive Jira synchronization.
- Support for additional document and media formats.
- Improved LLM response validation and structured output handling.

## Security and Configuration

- Store API keys and database credentials in environment variables.
- Do not commit `.env` files or other sensitive credentials.
- Review AI-generated requirements before using them in production documentation.
- Validate generated JSON before processing or exporting it.

## Acknowledgements

Developed as a collaborative software engineering project exploring the application of Large Language Models, multimodal AI, and automation in software requirements engineering.

