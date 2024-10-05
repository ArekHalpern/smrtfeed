-- CreateTable
CREATE TABLE "Paper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" JSONB NOT NULL,
    "keywords" TEXT[],
    "key_insights" JSONB NOT NULL,
    "conclusion" TEXT,
    "datePublished" TIMESTAMP(3) NOT NULL,
    "url" TEXT,
    "diagrams" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);
