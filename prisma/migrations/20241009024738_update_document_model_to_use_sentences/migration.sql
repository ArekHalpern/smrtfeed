-- CreateTable
CREATE TABLE "Sentence" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "sentence_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
