# Gothenburg CityReport

## Fault Reporting for Streets, Squares and Parks - Gothenburg Municipality

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/cityreport)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-operational-success.svg)](https://github.com/yourusername/cityreport)

### Overview

**CityReport** is a modern, easy-to-use platform that empowers citizens to report infrastructure faults in streets, squares, and parks. Designed with Swedish municipalities in mind, it supports the principle of public access to information (_offentlighetsprincipen_) by registering all reports as official public documents.

Report holes in streets, broken bike paths, malfunctioning street lights, overgrown bushes, damaged benches, or any maintenance issues. With photos, GPS location, and detailed descriptions, citizens help municipalities maintain better infrastructure and respond faster to community needs.

**🌍 Our Mission**

CityReport makes infrastructure fault reporting simple, transparent, and impactful. By giving everyone a voice to report problems, we enable faster response times, better resource allocation, and measurable community improvements. Every report contributes to safer streets, cleaner parks, and better-maintained public spaces.

### Key Features

- **📍 Geographic Data Visualization** - Interactive mapping with real-time data updates
- **📊 Advanced Analytics Dashboard** - Comprehensive statistics and reporting tools
- **🌱 Environmental Impact Tracking** - Monitor and improve environmental health
- **♻️ Sustainability Metrics** - Carbon-neutral operations and eco-friendly practices
- **🔒 Enterprise Security** - Role-based access control and encrypted data transmission
- **📱 Mobile-Responsive Design** - Optimized for field operations on any device
- **🗺️ High-Precision Geolocation** - Accurate coordinate tracking and validation
- **📸 Visual Documentation** - Image capture and storage with metadata
- **🔍 Data Export Capabilities** - Multiple format support for interoperability
- **⚡ Real-Time Updates** - Live data synchronization across all clients
- **🌍 Community Engagement** - Empower citizens to contribute to cleaner environments

### Technology Stack

#### Frontend

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Professional, responsive styling
- **Leaflet.js** - Interactive mapping library
- **React Hooks** - Modern state management

#### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL/MySQL** - Relational database
- **TypeScript** - Type-safe API development

### System Requirements

- **Node.js**: v20 or higher
- **pnpm**: v10.x
- **Database**: PostgreSQL 14+ or MySQL 8+
- **Memory**: 4GB RAM minimum (8GB recommended)
- **Storage**: 10GB available space

### Installation & Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mgis.git
cd mgis
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DATABASE=mgis_db

# API Configuration
PORT=3000
NODE_ENV=development
API_BASE_URL=http://localhost:3000
```

#### 4. Initialize Database

```bash
# Run database migrations
cd database
# Execute initialization scripts
```

#### 5. Start Development Servers

**API Server:**

```bash
cd api
pnpm dev
```

**Frontend Application:**

```bash
cd app
pnpm dev
```

### Production Deployment

#### Build for Production

```bash
# Build API
cd api
pnpm build
pnpm start

# Build Frontend
cd app
pnpm build
pnpm start
```

#### Docker Deployment

```bash
docker-compose up -d
```

### API Documentation

#### Health Check

```bash
GET /health
```

#### Geographic Data Endpoints

```bash
GET /api/heatmap/coordinates
GET /api/images
POST /api/images/upload
```

For complete API documentation, visit `/api/docs` when the server is running.

### Security Features

- **🔐 Authentication** - Secure user authentication and session management
- **🛡️ Authorization** - Role-based access control (RBAC)
- **🔒 Data Encryption** - SSL/TLS for data in transit
- **📝 Audit Logging** - Comprehensive activity tracking
- **🚨 Input Validation** - Protection against injection attacks

### Performance Optimization

- Server-side rendering with Next.js
- Image optimization and lazy loading
- Database query optimization
- CDN integration support
- Caching strategies

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Accessibility

MGIS is built with accessibility in mind:

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Contributing

We welcome contributions from the community. Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Support

For technical support, please contact:

- **Email**: support@cityreport.io
- **Documentation**: [https://docs.cityreport.io](https://docs.cityreport.io)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/cityreport/issues)

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Acknowledgments

- Built for organizations, municipalities, and communities
- Designed with security and environmental impact in mind
- Developed following industry best practices

### Version History

#### Version 1.0.0 (2025-01-07)

- Initial release
- Core geographic visualization features
- Professional enterprise-ready UI
- Environmental impact tracking
- Enterprise security features
- Mobile-responsive design

---

© 2025 Gothenburg CityReport. City of Gothenburg.
