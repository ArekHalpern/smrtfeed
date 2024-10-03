import React, { createContext, useState, useContext } from "react";

interface PaperContextType {
  selectedPaperId: string | null;
  setSelectedPaperId: (id: string | null) => void;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

export function PaperProvider({ children }: { children: React.ReactNode }) {
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);

  return (
    <PaperContext.Provider value={{ selectedPaperId, setSelectedPaperId }}>
      {children}
    </PaperContext.Provider>
  );
}

export function usePaper() {
  const context = useContext(PaperContext);
  if (context === undefined) {
    throw new Error("usePaper must be used within a PaperProvider");
  }
  return context;
}
