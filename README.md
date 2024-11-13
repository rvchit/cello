# Cello Image Viewer

[ React + TypeScript, Python + Vite ] + [ Node + Express ]

Here’s a structured and informative `README.md` that provides context about your project, its setup, usage, and contributions. Feel free to modify specific sections according to your project’s unique features and goals.

---

# Hist-Viewer

**Hist-Viewer** is a web-based application designed to facilitate image processing, annotation, and viewing. This project uses modern web technologies, a PostgreSQL database, and integrates with AWS S3 for efficient image handling and storage. The app supports advanced image processing, including tiling large images and serving specific regions dynamically.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dynamic Image Tiling**: Efficiently handle large images with dynamic tile loading to support zooming and panning.
- **AWS S3 Integration**: Store and fetch images securely with signed URLs.
- **Advanced Image Processing**: Use `sharp` for real-time image extraction, resizing, and format conversion.
- **Flexible Database Management**: Prisma ORM integration with PostgreSQL for scalable database operations.
- **SVS Image Processing Support**: Integrate with a Python microservice for handling SVS file formats.

## Project Structure

```
hist-viewer/
├── prisma/              # Prisma schema and migrations
├── src/
│   ├── backend/         # Backend API and service code
│   ├── components/      # Frontend components for UI
│   ├── server/          # Server setup and API endpoints
│   └── tests/           # Backend and frontend tests
├── .env                 # Environment configuration
├── .eslintrc            # ESLint configuration
├── jest.config.cjs      # Jest configuration for testing
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Prerequisites

- **Node.js**: Version 14 or higher
- **npm**: Version 6 or higher
- **PostgreSQL**: Version 12 or higher
- **AWS Account**: S3 bucket with appropriate permissions
- **Python 3.x** (for the SVS image processing microservice)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/kashkarthik/hist-viewer.git (fork)
   cd hist-viewer
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up the Database**:
   - Ensure PostgreSQL is running, and create a database for the project.
   - Run Prisma migrations to set up the database schema:

     ```bash
     npx prisma migrate dev --name init
     ```

## Configuration

1. **Environment Variables**:
   Create a `.env` file in the root directory with the following:

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

## Usage

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

## API Endpoints

- **Fetch Image URL**: `GET /image/:id/url`
  - Fetches a signed URL to access an image stored in S3.
  
- **Dynamic Tile Loading**: `GET /tile/:imageId/:level/:x/:y`
  - Loads a specific tile of an image for efficient zooming and panning.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a pull request.

Please ensure all tests pass before submitting your PR.

## License


