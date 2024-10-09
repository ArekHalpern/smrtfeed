"use server";

import { prisma } from '@/lib/db/prisma';

interface ExtractedSentence {
  sentenceNumber: number;
  content: string;
}

interface ExtractedPage {
  pageNumber: number;
  sentences: ExtractedSentence[];
}

interface ExtractedDocument {
  id: string;
  source: string;
  pages: ExtractedPage[];
}

export async function saveDocument(data: ExtractedDocument) {
  try {
    const document = await prisma.document.create({
      data: {
        source: data.source,
        pages: {
          create: data.pages.map((page: ExtractedPage) => ({
            pageNumber: page.pageNumber,
            sentences: {
              create: page.sentences.map((sentence: ExtractedSentence) => ({
                sentenceNumber: sentence.sentenceNumber,
                content: sentence.content,
              })),
            },
          })),
        },
      },
    });

    return document;
  } catch (error) {
    console.error('Error saving document:', error);
    throw new Error('Failed to save document');
  }
}
