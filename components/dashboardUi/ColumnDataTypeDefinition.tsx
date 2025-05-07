import React from 'react';
import {schemaTypeDefinition, SchemaDefinition} from '@/utils/types'

const ColumnDataTypeDefinition = ({
    SchemaDefinition,
    setSchemaDefinition,
    setLoading
}: {
    SchemaDefinition: SchemaDefinition;
    setSchemaDefinition: React.Dispatch<React.SetStateAction<SchemaDefinition>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

    // Function to update SchemaDefinition when a value changes
    const handleChange = (key: string, field: keyof schemaTypeDefinition, value: string | boolean | null | number) => {
        setLoading(true);
        setSchemaDefinition((prevSchema) => ({
            ...prevSchema,
            [key]: {
                ...prevSchema[key],
                [field]: value,
            },
        }));

        setLoading(false)
    };

    return (
        <div className="w-full dataTypeColumnContainer">
            {Object.keys(SchemaDefinition)
            .filter((key) => key !== "originalRowIndex")
            .map((key, index) => {
                const columnData = SchemaDefinition[key];

                return (
                    <div className="flex gap-2 w-full bg-blue py-6 border-t border-gray-700" key={index}>
                        <div className="w-auto p-4 rounded-lg">
                            <h4 className="mb-2 text-sm font-semibold para text-nowrap">Column</h4>
                            <h4 className="mb-2 text-base font-semibold heading">{key}</h4>
                        </div>

                        <div className="flex gap-2 flex-wrap w-full">
                            {/* Column Type */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Data Type:</h4>
                                <select
                                    value={columnData.dataType}
                                    onChange={(e) => handleChange(key, "dataType", e.target.value)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none"
                                >
                                    <option value="String">String</option>
                                    <option value="Integer">Integer</option>
                                    <option value="Float">Float</option>
                                    <option value="Email">Email</option>
                                    <option value="Boolean">Boolean</option>
                                    <option value="Date">Date</option>
                                    <option value="UUID">UUID</option>
                                    <option value="PhoneNumber">Phone Number</option>
                                    <option value="Array">Array</option>
                                    <option value="Object">Object</option>
                                    <option value="Timestamp">Timestamp</option>
                                    <option value="Currency">Currency</option>
                                    <option value="Percentage">Percentage</option>
                                    <option value="All">Allow all types</option>
                                </select>
                            </div>

                            {/* Numeric Sign Constraint */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Numeric Sign:</h4>
                                <select
                                    value={columnData.numericSign || "null"}
                                    onChange={(e) => handleChange(key, "numericSign", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Integer") && (columnData.dataType !== "Float") && (columnData.dataType !== "All")}
                                >
                                    <option value="Positive">Positive Only</option>
                                    <option value="Negative">Negative Only</option>
                                    <option value="">No Constraint</option>
                                </select>
                            </div>

                            {/* Precision */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Precision:</h4>
                                <select
                                    value={columnData.precision || "null"}
                                    onChange={(e) => handleChange(key, "precision", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Float") && (columnData.dataType !== "Number") && (columnData.dataType !== "All")}
                                >
                                    <option value="">No Limit</option>
                                    <option value={0}>0 (Whole numbers only)</option>
                                    <option value={1}>1 decimal place</option>
                                    <option value={2}>2 decimal places</option>
                                    <option value={3}>3 decimal places</option>
                                    <option value={4}>4 decimal places</option>
                                    <option value={5}>5 decimal places</option>
                                </select>
                            </div>

                            {/* Uniqueness Constraint */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Uniqueness:</h4>
                                <select
                                    value={columnData.unique ? "Unique" : "Non-Unique"}
                                    onChange={(e) => handleChange(key, "unique", e.target.value === "Unique")}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none"
                                >
                                    <option value="">Non-Unique (Duplicates permitted)</option>
                                    <option value="Unique">Unique (No duplicates allowed)</option>
                                </select>
                            </div>

                            {/* Date Format */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Date Format:</h4>
                                <select
                                    value={columnData.format || "null"}
                                    onChange={(e) => handleChange(key, "format", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Date") && (columnData.dataType !== "All")}
                                >
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                                    <option value="">Allow all formats</option>
                                </select>
                            </div>

                            {/* Date Separator */}
                            <div className="w-auto p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Date Separator:</h4>
                                <select
                                    value={columnData.separator || "null"}
                                    onChange={(e) => handleChange(key, "separator", e.target.value !== "null" ? e.target.value : null)}
                                    className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 focus:outline-none disabled:opacity-50"
                                    disabled={(columnData.dataType !== "Date") && (columnData.dataType !== "All")}
                                >
                                    <option value="/">/</option>
                                    <option value="-">-</option>
                                    <option value=",">,</option>
                                    <option value=".">.</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="w-full p-4 rounded-lg">
                                <h4 className="mb-2 text-sm font-semibold para">Description:</h4>
                                <textarea rows={3}  className="w-full font-medium secondaryBg text-sm rounded-md px-2 py-1 resize-none focus:outline-none disabled:opacity-50" placeholder='Describe the column' onChange={(e) => handleChange(key, "desc", e.target.value)} value={columnData.desc || ""}></textarea>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ColumnDataTypeDefinition;

