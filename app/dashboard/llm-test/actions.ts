'use server'

import { prisma } from '@/lib/db/prisma'

interface Change {
  start: number;
  end: number;
  suggestion: string;
}

export async function saveEditedText(content: string, newChanges: Change[]) {
  try {
    console.log("Saving edited text:", content);
    console.log("Saving changes:", newChanges);

    const editedText = await prisma.editedText.upsert({
      where: { id: 'latest' },
      update: {
        content,
        changes: JSON.stringify(newChanges),
      },
      create: {
        id: 'latest',
        content,
        changes: JSON.stringify(newChanges),
      },
    });

    console.log("Saved successfully:", editedText);
    return { success: true, id: editedText.id, changes: newChanges }
  } catch (error) {
    console.error('Failed to save edited text:', error)
    return { success: false, error: 'Failed to save edited text' }
  }
}

export async function getLatestEditedText() {
  try {
    const latestText = await prisma.editedText.findUnique({
      where: { id: 'latest' }
    });
    if (latestText) {
      return { 
        content: latestText.content, 
        changes: JSON.parse(latestText.changes as string) as Change[] 
      }
    }
    return null
  } catch (error) {
    console.error('Failed to retrieve latest edited text:', error)
    return null
  }
}
