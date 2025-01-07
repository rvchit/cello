import axios from "axios";

// Initiate the upload, getting an uploadId
export const initiateUpload = async (fileName: string) => {
  //console.log("initiated")
  
  // CHANGE FROM LOCAL HOST TO PROD
  const backendUrl = "http://localhost:4001";

  const response = await axios.post(`${backendUrl}/api/start-upload`, {
    fileName,
    fileType: "application/octet-stream",
  });
  return response.data; // { uploadId: "some-upload-id" }
};

// Upload each chunk with uploadId and partNumber
export const uploadChunk = async (
  chunk: Blob,
  fileName: string,
  uploadId: string,
  partNumber: number,
) => {
  const formData = new FormData();
  formData.append("fileChunk", chunk);
  formData.append("fileName", fileName);
  formData.append("partNumber", partNumber.toString());
  formData.append("uploadId", uploadId);

  // CHANGE FROM LOCAL HOST TO PROD
  const backendUrl = "http://localhost:4001";
  const response = await axios.post(`${backendUrl}/api/upload-part`, formData);
  return response.data; // { ETag: "some-etag" }
};

// Complete the multipart upload
export const completeUpload = async (
  fileName: string,
  uploadId: string,
  parts: Array<{ ETag: string; PartNumber: number }>,
) => {
  // CHANGE FROM LOCAL HOST TO PROD
  const backendUrl = "http://localhost:4001";
  const response = await axios.post(`${backendUrl}/api/complete-upload`, {
    fileName,
    uploadId,
    parts,
  });
  return response.data; // { fileUrl: "https://..." }
};
