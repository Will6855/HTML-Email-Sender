# HTML Email Sender

A modern, feature-rich Next.js application for composing and sending HTML emails with an intuitive user interface and powerful mailing list management. All configurations are stored securely in your browser, with no server setup required.

## Features

- **HTML Email Composition**
  - Rich text editor for creating beautiful HTML emails
  - Real-time preview of email content
  - Support for custom HTML templates

- **Mailing List Management**
  - Create and edit recipient lists
  - Import/export functionality
  - Group management
  - Contact categorization

- **SMTP Configuration**
  - Save SMTP settings directly in your browser
  - Secure local storage of credentials
  - Support for popular email services
  - No server configuration needed

- **Email Preview & Testing**
  - Preview emails across different devices
  - Send test emails before bulk sending
  - Validate email content and formatting

## Tech Stack

- **Frontend Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Email Service**: Nodemailer
- **Type Safety**: TypeScript
- **State Management**: React Context API
- **Storage**: Browser Local Storage

## Prerequisites

Before running the application, ensure you have:

- Node.js 18.x or higher
- npm or yarn package manager
- SMTP server details from your email provider

## Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Will6855/html-email-sender.git
   cd html-email-sender
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**
   ```bash
   npm run build
   npm start
   # or
   yarn build
   yarn start
   ```

## SMTP Configuration

The application stores all SMTP configurations securely in your browser's local storage. To set up your email service:

1. Click on the Settings/Configuration section in the app
2. Enter your SMTP server details:
   - SMTP Host (e.g., smtp.gmail.com)
   - Port (e.g., 587 for TLS)
   - Username (your email address)
   - Password (your email password or app-specific password)
3. Save the configuration (it will be stored in your browser)

Note: For services like Gmail, you may need to use an App Password instead of your regular password. Check your email provider's documentation for specific SMTP settings.

## Mailing Lists

1. Go to the Mailing Lists section
2. Create a new list or import existing contacts
3. Organize contacts into groups

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/Will6855/html-email-sender/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide as much detail as possible about your setup and the issue
