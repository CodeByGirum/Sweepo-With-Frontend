import {useState, useEffect} from 'react'
import {RecordType} from '@/utils/types'
import { useGlobalContext } from '@/context/context';


interface ResizableTableHeaderProps {
    columnWidths: Record<string, number>;
    handleColumnResize: (e: React.MouseEvent, key: string) => void;
    records: RecordType[]; 
  }

const ResizableTableHeader = ({
    columnWidths,
    handleColumnResize,
    records,
  }: ResizableTableHeaderProps) => {
  const [dataTypes, setDataTypes] = useState<Record<string, string>>({});
  const {schema} = useGlobalContext();

  useEffect(() => {
    setDataTypes(schema);
  }, [schema]);

  const handleChange = (key: string, value: string) => {
    setDataTypes((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex background text-secondary-foreground font-bold sticky top-0 z-20">
    <div
          className="flex items-center px-2 py-2 overflow-hidden background sticky left-0 z-10 border-b border-gray-500/20"
          style={{ width: `${columnWidths["rowNumber"]}px`, minWidth: "50px" }}
        >
          
          {/* Header Resize Handle */}  
          <span
            className="absolute right-0 top-0 bottom-0 w-px cursor-ew-resize bg-gray-500/20 flex items-center justify-center"
            onMouseDown={(e) => handleColumnResize(e, "rowNumber")}
          >
            
          </span>
        </div>
      {Object.keys(records[0] || {}).map((key) => (
        <div
          key={key}
          className="relative flex items-center px-2 py-2 overflow-hidden border-b border-gray-500/20"
          style={{ width: `${columnWidths[key]}px`, minWidth: "50px" }}
        >
            <div className='flex flex-col justify-center items-center mx-auto'>
                {key}
                <p className="italic font-normal">
                    <select
                        value={dataTypes[key]}
                        onChange={(e) => handleChange(key, e.target.value)} 
                        className="text-gray-500 background text-sm rounded-md px-2 py-1 focus:outline-none"
                    >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="boolean">Boolean</option>
                    </select>
                </p>
                {/* Header Resize Handle */}  
            </div>
          <span
            className="absolute right-0 top-0 bottom-0 w-px cursor-ew-resize bg-gray-500/20 flex items-center justify-center"
            onMouseDown={(e) => handleColumnResize(e, key)}
          >
            
          </span>
        </div>
      ))}
    </div>
  )
}

export default ResizableTableHeader