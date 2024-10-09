-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "page_number" INTEGER NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "line_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
