'use client';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">HTML Email Sender</span>
                  <span className="block text-indigo-600 mt-3">Personalized Mass Emailing Made Simple</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Send personalized HTML emails to your contact list with ease. Perfect for newsletters, marketing campaigns, and customer communications.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="/send-mail"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for email campaigns
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">CSV Support</div>
                <p className="mt-2 text-base text-gray-500">
                  Import your contact list from CSV files and manage your recipients easily.
                </p>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">HTML Templates</div>
                <p className="mt-2 text-base text-gray-500">
                  Create beautiful HTML emails with full styling support and preview functionality.
                </p>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">Personalization</div>
                <p className="mt-2 text-base text-gray-500">
                  Use dynamic variables to personalize each email with recipient-specific information.
                </p>
              </div>

              <div className="relative">
                <div className="text-lg leading-6 font-medium text-gray-900">File Attachments</div>
                <p className="mt-2 text-base text-gray-500">
                  Attach multiple files to your emails with easy drag-and-drop functionality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-10">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple three-step process
            </p>
          </div>

          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
            <div className="relative">
              <div className="text-lg leading-6 font-medium text-gray-900">1. Configure SMTP</div>
              <p className="mt-2 text-base text-gray-500">
                Set up your SMTP server details to enable email sending capabilities.
              </p>
            </div>

            <div className="relative">
              <div className="text-lg leading-6 font-medium text-gray-900">2. Import Contacts</div>
              <p className="mt-2 text-base text-gray-500">
                Upload your CSV file containing recipient information and map the email column.
              </p>
            </div>

            <div className="relative">
              <div className="text-lg leading-6 font-medium text-gray-900">3. Create & Send</div>
              <p className="mt-2 text-base text-gray-500">
                Compose your HTML email, add attachments if needed, and send to your contact list.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;