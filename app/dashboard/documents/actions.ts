"use server";

import { prisma } from '@/lib/db/prisma';

// ... (keep the existing interfaces and saveDocument function)

export async function getDocuments() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        pages: {
          include: {
            sentences: true
          }
        }
      }
    });
    return documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Failed to fetch documents');
  }
}

export async function getDocumentById(id: number) {
  try {
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        pages: {
          include: {
            sentences: true
          }
        }
      }
    });
    return document;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error('Failed to fetch document');
  }
}
