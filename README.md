# Nexus Admin Panel - Laravel Application Starter Kit

A powerful, modern, and extensible Laravel-based content management system designed for enterprise content management, digital publishing, and system administration.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PHP Version](https://img.shields.io/badge/PHP-8.2%2B-blue)
![Laravel Version](https://img.shields.io/badge/Laravel-11-red)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

Nexus Admin Panel is a comprehensive content management system built with Laravel 11 and React with Inertia. It features an intuitive admin interface, advanced RBAC, media management, and a powerful blogging platform, making it ideal for enterprises and digital publishers.

<h2>Screenshots</h2>
<h3>Dashboard</h3>



<h3>Media Manager</h3>



## Features

### Core System
- 🔐 Role-Based Access Control (RBAC)
- Role management
- Permission management
- User-role assignments
- Role-based menu visibility

- 👥 Advanced User Management
- Bulk actions
- User export
- Activity logging
- Password policies
- User profiles

- 🛡️ Security Features
- Two-factor authentication
- IP whitelist/blacklist
- Session management
- Security logs

### Content Management
- 📝 Page Builder
- Drag & drop interface
- Custom blocks
- Templates
- Version history

- 📸 Media Management
- File upload system
- Image optimization
- Gallery view
- File categorization

- 📰 Advanced Blogging
- Rich text editor
- Content scheduling
- Multi-author support
- Version control
- SEO tools

### System Tools
- ⚙️ System Settings
- Site configuration
- Email settings
- Theme customization
- Cache controls

- 📊 Analytics & Reporting
- Dashboard widgets
- Custom reports
- Data visualization
- Export options

## Requirements

- PHP 8.2 or higher
- MySQL 8.0+ or PostgreSQL 13+
- Node.js 18+
- Composer 2+

## Installation

1. Clone the repository
```bash
git clone https://github.com/wilfred-unsho/laravel-app-starter-kit.git
cd nexus-admin-panel

composer install

npm install

cp .env.example .env

php artisan key:generate

npm run build

php artisan serve

npm run dev

npm run watch

Architecture

├── app
│   ├── Http
│   │   ├── Controllers
│   │   │   └── Admin
│   │   ├── Middleware
│   │   └── Requests
│   ├── Services
│   ├── Repositories
│   └── Models
├── resources
│   └── js
│       ├── Components
│       │   └── Admin
│       ├── Layouts
│       └── Pages
│           └── Admin
└── routes


Contributing

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Credits

Wilfred
All Contributors

License
The MIT License (MIT). Please see License File for more information.


