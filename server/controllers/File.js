import { uploadFileToS3 } from "../utils/uploadToS3.js";
import { BadRequestError, UnauthenticatedError, NotFoundError } from '../errors/index.js';
import { queryDb } from "../DB_methods/query.js";
import { generatePresignedUrl } from "../utils/generatePreSignedUrl.js";
import { deleteFileFromS3 } from "../utils/deleteFromS3.js";
import { ParseS3File } from "../utils/ParseS3File.js";
import { generateSchemaDefinition } from "../utils/generateSchemaDefinition.js";
import { validateParsedData } from "../utils/validateParsedData.js";

export const UploadFile = async(req,res,next) => {
    const { userId } = req.user;
    const { category, description } = req.body;

    if (!userId) {
        throw new UnauthenticatedError("User not authenticated.");
    }
    

    if(!category || !description){
        throw new BadRequestError("Please provide all required information.");
    }

    const { 
        fileKey, 
        originalName, 
        fileType, 
        fileSize } = await uploadFileToS3(req,'file');

    // INSERT USER INTO DATABASE
    const newFile = await queryDb(
        `INSERT INTO files (user_id, original_name, category, description, file_key, file_type, file_size)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, originalName, category, description, fileKey, fileType, fileSize]
    );
    
    if (newFile.affectedRows) {

       // Fetch files from the database
        const userFiles = await queryDb(
            `SELECT file_id FROM files WHERE file_key = ? AND user_id = ?`,
            [fileKey,userId]
        );

        if (userFiles.length === 0) {
            throw new NotFoundError("No file found for the given user and file ID.");
        }
    
        const parsedData = await ParseS3File({fileKey, numOfRows:1})
        
        if (!parsedData || Object.keys(parsedData).length === 0) {
            throw new BadRequestError("Parsed data is invalid or empty");
        }

        let optimizedParsedData;
    
        if (typeof parsedData === "object" && !Array.isArray(parsedData)) {
            // Excel case: Extract the first sheet
            const sheetName = Object.keys(parsedData)[0]; 
            optimizedParsedData = parsedData[sheetName];
        } else {
            // CSV/JSON case: Use parsedData directly
            optimizedParsedData = parsedData;
        }

        const schemaDefinition = generateSchemaDefinition(optimizedParsedData);
        
        if ((schemaDefinition && Object.keys(schemaDefinition).length > 0)) {
            await queryDb(
                `INSERT INTO FileSchemas (file_id, user_id, schema_definition) VALUES (?, ?, ?)`,
                [userFiles[0].file_id, userId, JSON.stringify(schemaDefinition)]
            );

        }

        const fileSchemaDefinition = {
            file_id: userFiles[0].file_id,
            schema_definition: schemaDefinition
        }


        return res
                .status(201)
                .json({ 
                    status: true, 
                    message: "Uploaded successfully", 
                    fileSchemaDefinition
                });
    } else {
        return next(new Error("Failed to register user."));
    } 
}

export const getSchema = async(req, res) => {
    const {fileid} = req.query;
    const { userId } = req.user;

    if(!fileid && !userId){
        throw new BadRequestError("Please provide all required information.");
    }

    // Fetch files from the database
    const fetchSchema = await queryDb(
        `SELECT * FROM FileSchemas WHERE file_id = ? AND user_id = ?`,
        [fileid,userId]
    );

    if (fetchSchema.length === 0) {
        return res.status(200).json({ 
            status: false, 
            message: "No schema for this file." 
        });
    }

    return res.status(200).json({
        status:true, 
        result:fetchSchema
    })

}

export const editSchema = async(req, res) => {
    const {file_id, schema_definition, awareness} = req.body;
    const { userId } = req.user;

    if(!file_id && !schema_definition && !userId){
        throw new BadRequestError("Please provide all required information.");
    }

    // INSERT USER INTO DATABASE
    const updateSchema = await queryDb(
        `UPDATE FileSchemas SET  schema_definition = ?, awareness = ? WHERE file_id = ? AND user_id = ?`,
        [JSON.stringify(schema_definition), awareness, file_id, userId]
    );

    
    if(!updateSchema){
        throw new NotFoundError("No schema generated for this file, Please try again later!");
    }
    
    if(updateSchema.changedRows > 0){
        const userFiles = await queryDb(
            `SELECT file_id, file_key, original_name, category, description, progress, previous_response, file_schema FROM files WHERE file_id = ? AND user_id = ?`,
            [file_id,userId]
        );

        const fileKey = userFiles[0].file_key;

        const parsedData = await ParseS3File({fileKey, numOfRows:1})
        
        if (!parsedData || Object.keys(parsedData).length === 0) {
            throw new BadRequestError("Parsed data is invalid or empty");
        }

        let optimizedParsedData;
    
        if (typeof parsedData === "object" && !Array.isArray(parsedData)) {
            // Excel case: Extract the first sheet
            const sheetName = Object.keys(parsedData)[0]; 
            optimizedParsedData = parsedData[sheetName];
        } else {
            // CSV/JSON case: Use parsedData directly
            optimizedParsedData = parsedData;
        }

        const issues = validateParsedData(optimizedParsedData,schema_definition)
        const insertValues = issues.map(issue => [
            file_id, 
            userId, 
            issue.row, 
            JSON.stringify(issue.errors)
        ]);

        if (insertValues.length > 0) {
            await queryDb(
                `INSERT INTO issues (file_id, user_id, row_index, errors) VALUES ?`,
                [insertValues]
            );
        }
        
        return res.status(200).json({status:true, message:"Schema Updated Successfully"})
    }else{
        return res.status(200).json({status:false, message:"No change you have made."})
    }


}

export const getUserFiles = async (req, res) => {
    const { userId } = req.user;

    // Fetch files from the database
    const userFiles = await queryDb(
        `SELECT file_id, original_name, category, description, progress FROM files WHERE user_id = ? ORDER BY uploaded_at DESC`,
        [userId]
    );

    if (userFiles.length === 0) {
        return res.status(200).json({ 
            status: false, 
            message: "No file uploaded yet" 
        });
    }

    return res.status(200).json({ 
        status: true, 
        message: "Fetched successfully", 
        result:userFiles 
    });

    // Generate pre-signed URLs for each file
    // const filesWithUrls = await Promise.all(
    //     userFiles.map(async (file) => ({
    //         fileId: file.id,
    //         originalName: file.original_name,
    //         category: file.category,
    //         description: file.description,
    //         fileType: file.file_type,
    //         fileSize: file.file_size,
    //         fileUrl: await generatePresignedUrl(file.file_key),
    //     }))
    // );

    // res.status(200).json({ files: filesWithUrls });
};

export const deleteFile = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    const file = await queryDb(`SELECT * FROM files WHERE file_id = ?`, [id]);

    if (!file.length) {
        throw new BadRequestError("File not found.");
    }

    if (file[0].user_id !== userId) {
        throw new UnauthenticatedError("Unauthorized");
    }

    await deleteFileFromS3(file[0].file_key);

    await queryDb(`DELETE FROM files WHERE file_id = ?`, [id]);

    res
        .status(200)
        .json({ 
            status: true, 
            message: "The file was deleted successfully."
        });
};


export const getIssue = async(req, res) => {
    const {fileid} = req.query;
    const { userId } = req.user;

    if(!fileid && !userId){
        throw new BadRequestError("Please provide all required information.");
    }

    // Fetch files from the database
    const userFiles = await queryDb(
        `SELECT file_id, file_key, original_name, category, description, progress, previous_response, file_schema FROM files WHERE file_id = ? AND user_id = ?`,
        [fileid,userId]
    );

    console.log("userFiles ",userFiles);
    
    // Fetch issues from the database
    const fileIssues = await queryDb(
        `SELECT row_index, errors FROM issues WHERE file_id = ?`,
        [fileid]
    );

    if (userFiles.length === 0) {
        throw new NotFoundError("No file found for the given user and file ID.");
    }

    const fileKey = userFiles[0].file_key;

    const parsedData = await ParseS3File({ fileKey })

    if (!parsedData || Object.keys(parsedData).length === 0) {
        throw new BadRequestError("Parsed data is invalid or empty");
    }

    let records;

    if (typeof parsedData === "object" && !Array.isArray(parsedData)) {
        // Excel case: Extract the first sheet
        const sheetName = Object.keys(parsedData)[0]; 
        records = parsedData[sheetName];
    } else {
        // CSV/JSON case: Use parsedData directly
        records = parsedData;
    }

    const distinctRowIndexes = new Set(fileIssues.map(issue => issue.row_index)).size;
    const qualityScore = ((1 - (distinctRowIndexes / records.length)) * 100).toFixed(2);

    // Group issues by issue type
    const issuesByType = fileIssues.reduce((acc, issue) => {
        issue.errors.forEach(error => {
            if (!acc[error.issueType]) {
                acc[error.issueType] = [];
            }
            acc[error.issueType].push({
                row_index: issue.row_index,
                column: error.column,
                issueDesc: error.issueDesc
            });
        });
        return acc;
    }, {});

    // Group issues by column
    const columnWiseIssues = fileIssues.reduce((acc, issue) => {
        issue.errors.forEach(error => {
            if (!acc[error.column]) {
                acc[error.column] = [];
            }
            acc[error.column].push({
                row_index: issue.row_index,
                issueDesc: error.issueDesc,
                issueType: error.issueType
            });
        });
        return acc;
    }, {});

    // Calculate total affected columns
    const totalAffectedColumns = Object.keys(columnWiseIssues).length;
    
    // Define high-impact issue types
    const highImpactIssueTypes = ["NULL_VALUE", "TYPE_MISMATCH", "INVALID_FORMAT"];
    const highImpactIssues = fileIssues.reduce((count, issue) => {
        return count + issue.errors.filter(error => highImpactIssueTypes.includes(error.issueType)).length;
    }, 0);

    // Prepare data for bar chart (column name vs total issues in that column)
    const columnIssueCounts = Object.keys(columnWiseIssues).map(column => ({
        column,
        totalIssues: columnWiseIssues[column].length
    }));

    const impactLevels = {
        "NULL_VALUE": "High",
        "TYPE_MISMATCH": "High",
        "INVALID_FORMAT": "Medium",
        "INVALID_SEPARATOR": "Low",
        "INVALID_VALUE": "Medium",
        "DUPLICATE_VALUE": "Medium"
    };

    // Prepare data for issue type count chart with affected columns
    const issueTypeCounts = Object.keys(issuesByType).map((issueType) => {
        const totalCount = issuesByType[issueType].length;
        const affectedRows = new Set(issuesByType[issueType].map(issue => issue.row_index)).size;

        return {
        issueType,
        totalCount,
        columns: [...new Set(issuesByType[issueType].map(issue => issue.column))], 
        impact: impactLevels[issueType] || "Low",
        affectedPercentage: Number(((affectedRows / records.length) * 100).toFixed(2) )
    }});

    return res.status(200).json({
        status: true, 
        original_name: userFiles[0].original_name, 
        description: userFiles[0].description,
        records: records.slice(0, 5), 
        dataItems: records.length,
        issueItems: fileIssues.length,
        distinctIssueRows: distinctRowIndexes,
        totalAffectedColumns, 
        highImpactIssues, 
        qualityScore: Number(qualityScore),
        issuesByColumn: columnWiseIssues,
        issuesByType,
        columnIssueCounts, 
        issueTypeCounts 
    });
}
        