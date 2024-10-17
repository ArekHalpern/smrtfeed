import React from "react";

interface StructuredData {
  [key: string]: string | number | boolean | StructuredData | StructuredData[];
}

interface StructuredDataDisplayProps {
  data: StructuredData;
}

const StructuredDataDisplay: React.FC<StructuredDataDisplayProps> = ({
  data,
}) => {
  const renderValue = (
    value: StructuredData[keyof StructuredData]
  ): JSX.Element => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-4">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === "object" && value !== null) {
      return (
        <div className="pl-4">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="mb-2">
              <span className="font-semibold">{key}: </span>
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    } else {
      return <span>{String(value)}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      {renderValue(data)}
    </div>
  );
};

export default StructuredDataDisplay;
