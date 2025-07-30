import React, { useState } from 'react';
import { Search, Book, CreditCard, MapPin, Settings, Shield, ChevronDown, ChevronRight } from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = [
    {
      id: 'booking',
      title: 'Booking & Reservations',
      icon: Book,
      color: 'bg-blue-100 text-blue-600',
      articles: [
        {
          title: 'How to book a parking spot',
          content: 'To book a parking spot: 1) Browse available parking places, 2) Select your preferred location, 3) Choose an available slot, 4) Select date and time, 5) Complete payment, 6) Receive confirmation.'
        },
        {
          title: 'Canceling your reservation',
          content: 'You can cancel your reservation from the "My Bookings" section in your dashboard. Cancellations made at least 1 hour before your booking time are eligible for full refund.'
        },
        {
          title: 'Modifying existing bookings',
          content: 'To modify a booking, go to your booking history, select the booking you want to change, and click "Modify". You can change the time or extend your parking duration subject to availability.'
        },
        {
          title: 'Booking confirmation and receipts',
          content: 'After successful booking, you\'ll receive an email confirmation with booking details and a QR code. You can also download receipts from your booking history.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      icon: CreditCard,
      color: 'bg-green-100 text-green-600',
      articles: [
        {
          title: 'Accepted payment methods',
          content: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, and Google Pay. All transactions are secured with SSL encryption.'
        },
        {
          title: 'Refund policy',
          content: 'Full refunds are available for cancellations made at least 1 hour before your booking time. Refunds are processed within 3-5 business days to your original payment method.'
        },
        {
          title: 'Billing issues and disputes',
          content: 'If you notice any billing discrepancies, please contact our support team within 30 days. We\'ll investigate and resolve any legitimate billing issues promptly.'
        },
        {
          title: 'Pricing and fees',
          content: 'Pricing varies by location and time. Premium spots and peak hours may have higher rates. All fees are clearly displayed before booking confirmation.'
        }
      ]
    },
    {
      id: 'locations',
      title: 'Parking Locations',
      icon: MapPin,
      color: 'bg-purple-100 text-purple-600',
      articles: [
        {
          title: 'Finding parking near you',
          content: 'Use our location search feature to find parking spots near your destination. You can filter by distance, price, and amenities like covered parking or EV charging.'
        },
        {
          title: 'Parking spot types and amenities',
          content: 'We offer Regular, Premium, and EV charging spots. Premium spots offer better locations and additional features. All locations include basic security and lighting.'
        },
        {
          title: 'Accessibility features',
          content: 'Many of our locations offer accessible parking spots compliant with ADA requirements. Use the accessibility filter when searching for parking.'
        },
        {
          title: 'Security and safety',
          content: 'All parking locations feature security cameras, adequate lighting, and regular security patrols. Emergency contact information is available at each location.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      icon: Settings,
      color: 'bg-orange-100 text-orange-600',
      articles: [
        {
          title: 'Creating and verifying your account',
          content: 'Sign up with your email address and create a secure password. Verify your email to activate your account and start booking parking spots.'
        },
        {
          title: 'Updating profile information',
          content: 'You can update your profile information, including name, email, phone number, and payment methods, from the Profile section in your dashboard.'
        },
        {
          title: 'Password reset and security',
          content: 'If you forget your password, use the "Forgot Password" link on the login page. For security, we recommend using a strong, unique password and enabling two-factor authentication.'
        },
        {
          title: 'Deleting your account',
          content: 'To delete your account, go to Profile Settings and select "Delete Account". This action is permanent and will remove all your data and booking history.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
      articles: [
        {
          title: 'Mobile app and browser compatibility',
          content: 'SmartPark works on all modern browsers and mobile devices. For the best experience, we recommend using the latest version of Chrome, Firefox, Safari, or Edge.'
        },
        {
          title: 'Troubleshooting common issues',
          content: 'Common issues include: clearing browser cache, checking internet connection, disabling ad blockers, and ensuring JavaScript is enabled. Try refreshing the page first.'
        },
        {
          title: 'Reporting bugs and feedback',
          content: 'Found a bug or have suggestions? Use the feedback form in your dashboard or contact our support team. We appreciate all feedback to improve our service.'
        },
        {
          title: 'System maintenance and updates',
          content: 'We perform regular maintenance to keep our system running smoothly. Scheduled maintenance is announced in advance, and emergency maintenance is kept to a minimum.'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Help Center
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Find answers to your questions and get the help you need
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Help Topics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all text-center group"
              >
                <div className={`${category.color} rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-gray-900">{category.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Help Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length > 0 ? (
            <div className="space-y-6">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={`${category.color} rounded-lg p-2 mr-4`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                      <span className="ml-2 text-sm text-gray-500">({category.articles.length} articles)</span>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className="px-6 pb-4">
                      <div className="space-y-4">
                        {category.articles.map((article, index) => (
                          <div key={index} className="border-l-4 border-blue-200 pl-4">
                            <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{article.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Browse the categories above to find help articles'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Live Chat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;