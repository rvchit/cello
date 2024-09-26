import axios from 'axios';
import { initiateUpload, uploadChunk, completeUpload } from '../src/backend/fileuploadapi';

// Mock axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fileuploadapi', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to prevent test contamination
  });

  describe('initiateUpload', () => {
    it('should initiate the upload and return uploadId', async () => {
      // Arrange
      const mockResponse = { data: { uploadId: 'some-upload-id' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await initiateUpload('testFile.txt');

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/start-upload', {
        fileName: 'testFile.txt',
        fileType: 'application/octet-stream',
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('uploadChunk', () => {
    it('should upload a file chunk and return ETag', async () => {
      // Arrange
      const mockResponse = { data: { ETag: 'some-etag' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const chunk = new Blob(['file chunk data']);
      const fileName = 'testFile.txt';
      const uploadId = 'some-upload-id';
      const partNumber = 1;

      // Act
      const result = await uploadChunk(chunk, fileName, uploadId, partNumber);

      // Assert
      const formData = new FormData();
      formData.append('fileChunk', chunk);
      formData.append('fileName', fileName);
      formData.append('partNumber', partNumber.toString());
      formData.append('uploadId', uploadId);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/upload-part', formData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('completeUpload', () => {
    it('should complete the multipart upload and return fileUrl', async () => {
      // Arrange
      const mockResponse = { data: { fileUrl: 'https://some-url.com/testFile.txt' } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const fileName = 'testFile.txt';
      const uploadId = 'some-upload-id';
      const parts = [{ ETag: 'some-etag', PartNumber: 1 }];

      // Act
      const result = await completeUpload(fileName, uploadId, parts);

      // Assert
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/complete-upload', {
        fileName,
        uploadId,
        parts,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
