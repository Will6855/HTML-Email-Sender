<div align="center">

# HTML Email Sender 📧

A modern, feature-rich Next.js application for composing and sending HTML emails with an intuitive user interface and powerful mailing list management. All configurations are stored securely in your browser, with no server setup required.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-43853D)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> ⚠️ **Security Note**: This application is designed for local use or deployment in controlled environments. Public deployment is not recommended due to the sensitive nature of email sending capabilities.

[Documentation](#📚-documentation) | [Features](#✨-features) | [Getting Started](#🚀-getting-started) | [Contributing](#🤝-contributing)

![Application Screenshot](public/screenshot.png)

</div>

## 🎯 Key Features at a Glance

- 📝 **Rich HTML Email Editor** with real-time preview
- 📊 **Contact Management** with import/export capabilities
- 💾 **Template System** for reusable email designs
- 🔒 **Local Storage** for enhanced security
- 🎨 **Modern UI/UX** with responsive design
- 🔧 **Multi-Account Support** for different SMTP configurations

## ✨ Features

### 📝 HTML Email Composition
- **Rich Text Editor**
  - Intuitive WYSIWYG interface
  - Real-time preview of email content
  - Support for custom HTML templates
  - Responsive email templates

### 👥 Mailing List Management
- **Comprehensive Contact Management**
  - Create and edit recipient lists
  - Import/export functionality (CSV)
  - Contact grouping and tagging
  - Duplicate detection
  - Bulk operations support

## 📚 Documentation

### Template Management
- **Save Templates**
  - Create and save reusable email templates
  - Use variables in templates for personalization
  - Preview templates

### Contact Management
- **Address Book**
  - Add and organize contacts with custom fields
  - Create contact groups for easier sending
  - Import contacts from CSV files
  - Export your contact list for backup

### SMTP Configuration
- **Email Service Setup**
  1. Navigate to Account Settings
  2. Click "Add New Account"
  3. Enter your SMTP details:
     - Name (e.g., "John Doe")
     - Email (your email address)
     - Password (your email password or app-specific password)
     - SMTP Server (e.g., smtp.gmail.com)
     - Port (usually 587 for TLS)

- **Common SMTP Settings**
  | Service       | Server           | Port | Security |
  |--------------|------------------|------|-----------|
  | Gmail        | smtp.gmail.com   | 587  | TLS      |
  | Outlook      | smtp.office365.com| 587 | TLS      |
  | Yahoo Mail   | smtp.mail.yahoo.com| 587| TLS      |
  | Amazon SES   | (Custom URL)     | 587  | TLS      |

### Security Best Practices
- Use app-specific passwords for Gmail and other services
- Enable 2FA on your email accounts
- Keep your templates and contact lists backed up

## 🚀 Getting Started

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: 18.x or later
- **Memory**: 2GB RAM minimum
- **Storage**: 1GB free space
- **Browser**: Modern browser (Chrome, Firefox, Edge, Safari)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Will6855/html-email-sender.git
cd html-email-sender
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔒 Security

- All sensitive data is stored locally in your browser
- No data is sent to external servers
- SMTP connections are secure and encrypted

## ❗ Troubleshooting

### Common Issues

1. **SMTP Connection Failed**
   - Verify your SMTP credentials
   - Check if your email provider requires an app-specific password
   - Ensure your email service allows SMTP access

2. **Template Rendering Issues**
   - Clear browser cache
   - Check HTML syntax
   - Verify CSS compatibility

3. **Import/Export Problems**
   - Ensure CSV files are properly formatted
   - Check file encoding (UTF-8 recommended)
   - Verify required columns are present

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💁 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/Will6855/html-email-sender/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible about your setup and the issue

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Nodemailer](https://nodemailer.com/) - Email sending functionality
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

<div align="center">
Made with ❤️ by Will6855

[Report Bug](https://github.com/Will6855/html-email-sender/issues) · [Request Feature](https://github.com/Will6855/html-email-sender/issues)
</div>
