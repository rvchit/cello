
# **Histology Viewer API Documentation**

## **Base URL**  
`https://api.histviewer.example.com`

---

## **Authentication**

All endpoints require an API key passed via the `Authorization` header.

### **Header Example**
```http
Authorization: Bearer YOUR_API_KEY
```

---

## **Endpoints**

### **1. Upload Image**
Upload a Whole Slide Image (WSI) to the server for processing.

**URL:** `/upload`  
**Method:** `POST`  
**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer YOUR_API_KEY`

**Body (Form Data):**
- `file` (Required): The WSI file to upload.
- `name` (Optional): A custom name for the image.

**Response:**
- **200 OK**
    ```json
    {
      "message": "Upload successful",
      "imageId": "123456",
      "dziUrl": "https://s3.amazonaws.com/tiles/123456.dzi"
    }
    ```
- **400 Bad Request**
    ```json
    {
      "error": "Invalid file type"
    }
    ```

---

### **2. Fetch Tiled Image**
Retrieve a specific Deep Zoom Image (DZI) for rendering in the viewer.

**URL:** `/images/{imageId}`  
**Method:** `GET`  
**Headers:**
- `Authorization: Bearer YOUR_API_KEY`

**Path Parameters:**
- `imageId` (Required): ID of the image.

**Response:**
- **200 OK**
    ```json
    {
      "dziUrl": "https://s3.amazonaws.com/tiles/123456.dzi",
      "metadata": {
        "dimensions": "10000x10000",
        "levels": 5,
        "tileSize": 256
      }
    }
    ```
- **404 Not Found**
    ```json
    {
      "error": "Image not found"
    }
    ```

---

### **3. Create Annotation**
Save an annotation for a specific image.

**URL:** `/annotations`  
**Method:** `POST`  
**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_API_KEY`

**Body:**
```json
{
  "imageId": "123456",
  "type": "polygon",
  "points": [
    [100, 200],
    [150, 250],
    [200, 200]
  ],
  "label": "Tumor"
}
```

**Response:**
- **201 Created**
    ```json
    {
      "message": "Annotation created successfully",
      "annotationId": "78910"
    }
    ```
- **400 Bad Request**
    ```json
    {
      "error": "Invalid annotation data"
    }
    ```

---

### **4. Fetch Annotations**
Retrieve all annotations for a specific image.

**URL:** `/images/{imageId}/annotations`  
**Method:** `GET`  
**Headers:**
- `Authorization: Bearer YOUR_API_KEY`

**Path Parameters:**
- `imageId` (Required): ID of the image.

**Response:**
- **200 OK**
    ```json
    {
      "annotations": [
        {
          "annotationId": "78910",
          "type": "polygon",
          "points": [
            [100, 200],
            [150, 250],
            [200, 200]
          ],
          "label": "Tumor",
          "createdAt": "2024-11-14T10:00:00Z"
        }
      ]
    }
    ```

---

### **5. Delete Annotation**
Remove a specific annotation.

**URL:** `/annotations/{annotationId}`  
**Method:** `DELETE`  
**Headers:**
- `Authorization: Bearer YOUR_API_KEY`

**Path Parameters:**
- `annotationId` (Required): ID of the annotation.

**Response:**
- **200 OK**
    ```json
    {
      "message": "Annotation deleted successfully"
    }
    ```
- **404 Not Found**
    ```json
    {
      "error": "Annotation not found"
    }
    ```

---

### **6. Generate Pre-Signed URL**
Get a pre-signed URL to download an image or tile.

**URL:** `/images/{imageId}/presigned-url`  
**Method:** `GET`  
**Headers:**
- `Authorization: Bearer YOUR_API_KEY`

**Path Parameters:**
- `imageId` (Required): ID of the image.

**Query Parameters:**
- `fileType` (Optional): Type of file to download (`dzi`, `metadata`, etc.).

**Response:**
- **200 OK**
    ```json
    {
      "url": "https://s3.amazonaws.com/tiles/123456.dzi?signature=abc123"
    }
    ```

---

## **Error Codes**

| Code | Description                 |
|------|-----------------------------|
| 200  | Request successful          |
| 201  | Resource created            |
| 400  | Bad request                 |
| 401  | Unauthorized                |
| 404  | Resource not found          |
| 500  | Internal server error       |

---

## **Rate Limiting**
All endpoints are rate-limited to **100 requests per minute**. Exceeding this limit will return a **429 Too Many Requests** response.

---

### **How to Use**

To use this API in your project, import the following resources:
- Your API key for authentication.
- URLs returned by the endpoints for the DZI image viewer (e.g., OpenSeadragon).

---

---

## **Additional Endpoints**

### **1. Start Multipart Upload**
Initiates a multipart upload process.

**URL:** `/api/start-upload`  
**Method:** `POST`  
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
    "fileName": "WIN_20240209_13_17_03_Pro.mp4",
    "fileType": "video/mp4"
}
```

**Response:**
- **200 OK**
    ```json
    {
        "uploadId": "Yt6GIu4Nadue203cQTMLS05qcFA6A7.8fbLFcIL43ikJjGRnkfbDwMP3kZ75BYGxrxNBEKfNqKenQAD7hCjlLUBUugRS35VQQGs.HM4qp4pQdWFJzgRYLwTeLxA3GFD8"
    }
    ```

---

### **2. Upload Part**
Uploads a specific part of a file during a multipart upload.

**URL:** `/api/upload-part`  
**Method:** `POST`  
**Headers:**
- `Content-Type: multipart/form-data`

**Body (Form Data):**
- `fileChunk`: The chunk of the file being uploaded.
- `fileName`: The name of the file.
- `partNumber`: The part number of the chunk.
- `uploadId`: The ID returned by `/api/start-upload`.

**Response:**
- **200 OK**
    ```json
    {
        "ETag": ""a5539cfee42b1a552a8afedde7b5736c""
    }
    ```

---

### **3. Complete Multipart Upload**
Completes the multipart upload process.

**URL:** `/api/complete-upload`  
**Method:** `POST`  
**Headers:**
- `Content-Type: application/json`

**Body:**
```json
{
  "fileName": "DSCN0009.JPG",
  "uploadId": "f.F1xEPMO_CzBClErLRmKMCpBCGw87HvQVqqyPBiZNO4t1Zxw3fykGKXtoCpAT.NGlQcDNsU51uugiPjmRwisRGyZxTr3cLS3W2MAao8XAGJrbU__sxF.idHpQR.5UUj",
  "parts": [
    { "ETag": ""a5539cfee42b1a552a8afedde7b5736c"", "PartNumber": 1 }
  ]
}
```

**Response:**
- **200 OK**
    ```json
    {
        "fileUrl": "https://cello-bucket.s3.us-east-2.amazonaws.com/DSCN0009.JPG"
    }
    ```

---

### **4. Fetch Image URL**
Fetches the URL of an image.

**URL:** `/view/image/:id/url`  
**Method:** `GET`  
**Path Parameters:**
- `id`: The ID of the image.

**Response:**
- **200 OK**
    ```json
    {
        "message": "Image URL fetched successfully",
        "imageUrl": "https://cello-bucket.s3.us-east-2.amazonaws.com/CMU-1-Small-Region.svs?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAXZEFIK5OVLTFLYYJ%2F20240924%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20240924T185811Z&X-Amz-Expires=3600&X-Amz-Signature=13d1f4830206dfd334900fc86d617dbe6dfe83339d0e17545c10ef2b5b85bfbf&X-Amz-SignedHeaders=host&x-id=GetObject"
    }
    ```

---

### **5. Fetch Tile for OpenSeadragon**
Fetches a specific tile for rendering in OpenSeadragon.

**URL:** `/osd/tile/:imageId/:level/:x/:y`  
**Method:** `GET`  
**Path Parameters:**
- `imageId`: The ID of the image.
- `level`: The zoom level of the tile.
- `x`: The x-coordinate of the tile.
- `y`: The y-coordinate of the tile.

**Response:**
- **200 OK**
    - Tile image is returned as the response body.
