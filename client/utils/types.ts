/**
 * Type Definitions
 * Purpose: Defines TypeScript interfaces and types used throughout the application
 * Used in: All components and utilities
 * Features:
 * - Project and file type definitions
 * - Issue and error type definitions
 * - Schema type definitions
 * - Action and record type definitions
 */

/**
 * Project type definition
 * Represents a data cleaning project
 */
export interface projectType {
    file_id:string;
    original_name:string;
    description:string;
    category:string;
    progress:number;
    status?: "Planning" | "In Progress" | "Completed";
    tags?: string[];
    favorited?: boolean;
    timestamp?: string;
    timestamp_order?: number;
    created_at?: string;
    upload_date?: string;
    upload_time?: string;
}

/**
 * Issue distribution type definition
 * Represents the distribution of issues by type
 */
export interface IssueDistributionType  {
    IssueType:string;
    IssueDetected: number;
    fill?:string;
}

/**
 * Column problem type definition
 * Represents problems detected in a specific column
 */
export interface ColumnProblem {
  column: string;
  numberOfProblems: number;
}

/**
 * Issue count type definition
 * Represents the count of issues by type
 */
export interface IssueCountType {
  issueType:string;
  totalCount:number; 
  columns:string[];
  impact:string;
  affectedPercentage:number;
}

/**
 * Column issue type definition
 * Represents issues in a specific column
 */
export interface ColumnIssueType {
  column:string;
  totalIssues:number;
}

/**
 * Error detection type definition
 * Represents detected errors and their details
 */
export interface ErrorDetectionType {
  DataInconsistency: string;
  DetectionStatus: number;
  ImpactLevel: string;
  Questions: string;
  HowManyDetected: number;
  AffectedPercentage: string;
  FieldColumnName: string[];
  RecommendedAction: string;
}

/**
 * Props type definition
 * Represents component props with file ID
 */
export type Props = {
  params: Promise<{
    fileid: string | undefined;
  }>;
};

/**
 * File details type definition
 * Represents basic file information
 */
export interface fileDetailsType {
  original_name: string;
  description: string;
}

/**
 * Action type definition
 * Represents an action taken in the system
 */
export interface Action<T = unknown> { 
  action_id: string;
  file_id: string;
  user_id: string;
  title: string;
  response: string;
  summary: string;
  action_type: string;
  chat: string;
  action_details: T; 
  created_at: string;
}

/**
 * Record type definition
 * Represents a data record with dynamic keys
 */
export interface RecordType {
  [key: string]: string | number | boolean | null; 
}

/**
 * Error type definition
 * Represents a specific error in a column
 */
export interface error {
  column: string;
  issueType: string;
  issueDesc: string;
}

/**
 * Issue type definition
 * Represents issues in a specific row
 */
export interface Issue {
  row: number;
  errors: error[];
}

/**
 * Payload type definition
 * Represents user registration payload
 */
export interface Payload {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Schema type definition
 * Represents a simple schema with string values
 */
export interface Schema {
  [key: string]: string; 
}

/**
 * Schema type definition
 * Represents detailed schema information for a column
 */
export interface schemaTypeDefinition {
  dataType: string;
  unique: boolean;
  numericSign: string | null;
  precision: number | null;
  format: string | null;
  separator: string | null;
  desc: string | null;
}

/**
 * Schema definition type
 * Represents a complete schema with column definitions
 */
export interface SchemaDefinition {
  [key: string]: schemaTypeDefinition;
}

/**
 * Schema type
 * Represents a schema with metadata
 */
export interface SchemaType {
  schema_id?: string;
  user_id?: string;
  file_id: string;
  schema_definition: SchemaDefinition;
  awareness: string;
  created_at?: string;
  updated_at?: string;
  timestamp?: string;
  timestamp_order?: number;
} 

/**
 * Compute data type
 * Represents computed statistics about data quality
 */
export interface computeDataType {
  issueDistribution: IssueDistributionType[],
  sortedColumnProblemCount: ColumnProblem[],
  totalIssues: number,
  highImpactCount: number,
  totalPercentage: number,
  totalDistinctColumns: number,
}