import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Requirement } from '@/types/requirements';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const textInput = formData.get('textInput') as string | null;
    
    const results: { [key: string]: Requirement[] } = {};
    let reqId = 1;

    // Process text input if provided
    if (textInput) {
      const textRequirements = await processTextInput(textInput, reqId);
      results['text-input'] = textRequirements;
      reqId += textRequirements.length;
    }

    // Process each file
    for (const file of files) {
      const fileRequirements = await processFile(file, reqId);
      results[file.name] = fileRequirements;
      reqId += fileRequirements.length;
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing requirements:', error);
    return NextResponse.json({ error: 'Failed to process requirements' }, { status: 500 });
  }
}

async function processTextInput(text: string, startId: number): Promise<Requirement[]> {
  // Split text into sentences and identify requirements
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const requirements: Requirement[] = [];
  let currentId = startId;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (isRequirement(trimmedSentence)) {
      requirements.push({
        id: currentId++,
        text: trimmedSentence,
        type: determineRequirementType(trimmedSentence),
        priority: determinePriority(trimmedSentence),
        status: "Clear",
      });
    }
  }

  return requirements;
}

async function processFile(file: File, startId: number): Promise<Requirement[]> {
  const text = await file.text();
  return processTextInput(text, startId);
}

function isRequirement(text: string): boolean {
  const requirementKeywords = [
    'shall', 'must', 'should', 'will', 'needs to', 'has to',
    'requires', 'required', 'necessary', 'important'
  ];
  const lowercaseText = text.toLowerCase();
  return requirementKeywords.some(keyword => lowercaseText.includes(keyword));
}

function determineRequirementType(text: string): "Functional" | "Non-Functional" {
  const nfrKeywords = [
    'performance', 'security', 'reliability', 'availability', 'maintainability',
    'scalability', 'usability', 'response time', 'throughput', 'concurrent',
    'simultaneously', 'seconds', 'minutes', 'hours', 'storage', 'memory',
    'backup', 'recover', 'log', 'audit', 'monitor', 'report'
  ];
  
  const lowercaseText = text.toLowerCase();
  return nfrKeywords.some(keyword => lowercaseText.includes(keyword)) 
    ? "Non-Functional" 
    : "Functional";
}

function determinePriority(text: string): "Must" | "Should" | "Could" | "Won't" {
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes('must') || lowercaseText.includes('shall')) {
    return "Must";
  } else if (lowercaseText.includes('should')) {
    return "Should";
  } else if (lowercaseText.includes('could') || lowercaseText.includes('may')) {
    return "Could";
  } else {
    return "Should"; // Default priority
  }
} 