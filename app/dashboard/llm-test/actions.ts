'use server'


import prisma from '@/lib/db/prisma'
import { revalidatePath } from 'next/cache'

export async function getDocument(id: number) {
  return await prisma.document.findUnique({
    where: { id },
    select: { id: true, source: true, content: true }
  })
}

export async function updateDocument(id: number, content: string) {
  const document = await prisma.document.update({
    where: { id },
    data: { content },
    select: { id: true, source: true, content: true }
  })
  revalidatePath('/dashboard/llm-test')
  return document
}

export async function createDocument(source: string, content: string) {
  const document = await prisma.document.create({
    data: {
      source,
      content,
    },
    select: { id: true, source: true, content: true }
  })
  revalidatePath('/dashboard/llm-test')
  return document
}

export async function deleteDocument(id: number) {
  await prisma.document.delete({
    where: { id },
  })
  revalidatePath('/dashboard/llm-test')
}

export async function getAllDocuments() {
  return await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, source: true, content: true }
  })
}
