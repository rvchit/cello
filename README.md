# Cello- Histology Viewer

**Cello** is a web-based application designed for visualizing, annotating, and managing histology images. With advanced image processing tools and a user-friendly interface, it helps researchers and medical professionals interact with high-resolution histological images efficiently. Hist-Viewer supports annotation, commenting, and zooming/panning on large images, with secure storage and scalable architecture.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Why Use Hist-Viewer?](#why-use-hist-viewer)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Toolbar and Tools](#toolbar-and-tools)
  - [Annotations and Comments](#annotations-and-comments)
  - [File Directory](#file-directory)
- [Support](#support)
- [Contributing](#contributing)
- [Maintainers](#maintainers)

---

## Project Overview

Hist-Viewer provides an interactive platform to view, annotate, and analyze large histology images, commonly used in pathology and medical research. The project utilizes modern web technologies, scalable database management, and AWS storage to enable efficient and secure handling of histology data.

---

## Why Use Hist-Viewer?

Hist-Viewer offers specialized tools for professionals in medical and scientific research, enhancing the workflow for handling large, complex images. Key benefits include:

- Efficient image loading and dynamic tiling, which supports zoom and pan functions.
- User-friendly interface with commenting and annotation tools for collaborative research.
- Integration with AWS S3 for secure image storage and retrieval.
- Scalable architecture, compatible with PostgreSQL and Prisma ORM for database operations.
  <img width="766" alt="image" src="https://github.com/user-attachments/assets/50ee83eb-5885-4a70-8618-8ca38da830eb" />


---

## Features

- **Dynamic Image Tiling**: Load large images in tiles to enable smooth zoom and pan functionality.
- **Annotation Tools**: Includes tools for adding text, shapes, and drawings on images with adjustable coordinates to support zoomed-in views.
- **Commenting System**: View and add comments linked to specific image coordinates.
- **File Management**: Easily manage uploaded images via a file directory view.
- **AWS S3 Integration**: Securely store and access images via signed URLs.
- **Database Support**: Prisma ORM integration with PostgreSQL for efficient database management.

---

## Getting Started

### Prerequisites

Ensure the following software is installed on your machine:

- **Node.js**: Version 14 or higher
- **npm**: Version 6 or higher
- **PostgreSQL**: Version 12 or higher
- **AWS Account**: For setting up an S3 bucket
- **Python 3.x**: Required for advanced SVS image processing (if applicable)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rvchit/cello.git
   cd hist-viewer
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up the Database**:
   - Ensure PostgreSQL is running and create a database for the project.
   - Run Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev --name init
     ```

### Configuration

1. **Environment Variables**: Create a `.env` file in the root directory with the following configuration:

   ```plaintext
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/histviewer"
   AWS_ACCESS_KEY="<Your AWS Access Key>"
   AWS_SECRET_KEY="<Your AWS Secret Key>"
   S3_BUCKET="<Your S3 Bucket Name>"
   AWS_REGION="<Your AWS Region>"
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

### Running the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Access Prisma Studio** (for viewing and editing database records):
   ```bash
   npx prisma studio
   ```
3. **Run Tests**:
   ```bash
   npm test
   ```

---

## Usage

### Toolbar and Tools

- **Text Tool**: Add text annotations to selected coordinates on the image.
- **Draw Tool**: Draw freeform annotations.
- **Shape Tool**: Draw rectangular shapes and other forms for marking areas of interest. Coordinates of the shapes will automatically scale with zoom.

### Annotations and Comments

Hist-Viewer allows users to add comments to specific regions on the image. Annotations and comments are displayed in a sidebar to the right, allowing users to review or delete them as needed.

### File Directory

The **File Directory** section provides a list of uploaded images and options to select and load each for viewing and annotation.

---

## Support

If you have questions or need help with Hist-Viewer, please use one of the following resources:

- **GitHub Issues**: Open a [new issue](https://github.com/rvchit/cello /issues) to report bugs or request features.
- **Documentation**: Refer to this README and in-line documentation within the codebase.

---

## Contributing

We welcome contributions to Hist-Viewer! To contribute:

1. **Fork** the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

Please ensure all tests pass before submitting your pull request.

---

## Maintainers

- **Kaushik Karthikeyan** - Project Maintainer
- **Rachit Bisht** - Project Maintainer


