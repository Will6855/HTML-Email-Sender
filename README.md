<div align="center">

# HTML Email Sender 📧

A modern, feature-rich Next.js application for composing and sending HTML emails with an intuitive user interface and powerful mailing list management. All configurations are stored securely in your browser, with no server setup required.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> ⚠️ **Security Note**: This application is designed for local use or deployment in controlled environments. Public deployment is not recommended due to the sensitive nature of email sending capabilities.

[Documentation](#documentation) | [Features](#features) | [Installation](#installation) | [Contributing](#contributing)

![Application Screenshot](public/screenshot.png)

</div>

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

### ⚙️ SMTP Configuration
- **Secure Settings Management**
  - Save SMTP settings locally in your browser
  - Support for popular email services:
    - Gmail
    - Outlook
    - Amazon SES
    - Custom SMTP servers

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn package manager

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

## 📖 Documentation

### Configuration
Configure your SMTP settings in the application:

1. Navigate to Settings
2. Enter your SMTP credentials:
   - SMTP Host
   - Port
   - Username
   - Password

### Creating Your First Email

1. Click "New Email" button
2. Compose your email using the rich text editor
3. Add recipients from your contact list
4. Preview and send!

## 🔒 Security

- All sensitive data is stored locally in your browser
- No data is sent to external servers
- SMTP connections are secure and encrypted

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
</div>
