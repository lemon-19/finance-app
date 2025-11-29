import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DollarSign, CreditCard, FileText, Wallet, 
  TrendingUp, Shield, Bell, PieChart, 
  CheckCircle, ArrowRight, Star, Users 
} from "lucide-react";

const year = new Date().getFullYear();

export default function Landing() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Memoized feature data
  const features = useMemo(() => [
    { 
      icon: DollarSign, 
      color: "blue", 
      title: "Track Income", 
      text: "Log salary, freelance, and other income sources effortlessly." 
    },
    { 
      icon: CreditCard, 
      color: "red", 
      title: "Manage Expenses", 
      text: "See where your money goes each month with detailed insights." 
    },
    { 
      icon: FileText, 
      color: "orange", 
      title: "Stay on Top of Bills", 
      text: "Never miss a due date with smart bill reminders." 
    }
  ], []);

  // Memoized benefits data
  const benefits = useMemo(() => [
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Get insights into your spending patterns and financial trends over time."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with bank-level security."
    },
    {
      icon: Bell,
      title: "Bill Reminders",
      description: "Receive timely notifications for upcoming bills and payment deadlines."
    },
    {
      icon: PieChart,
      title: "Budget Planning",
      description: "Create and track budgets to achieve your financial goals faster."
    }
  ], []);

  // Memoized stats data
  const stats = useMemo(() => [
    { value: "5,000+", label: "Active Users" },
    { value: "₱2M+", label: "Money Tracked" },
    { value: "15,000+", label: "Bills Paid" },
    { value: "4.8★", label: "User Rating" }
  ], []);

  // Memoized testimonials data
  const testimonials = useMemo(() => [
    {
      name: "Maria Santos",
      role: "Freelancer",
      text: "This app helped me organize my finances. I can now track my income and expenses easily!",
      rating: 5
    },
    {
      name: "Juan dela Cruz",
      role: "Small Business Owner",
      text: "Managing bills has never been easier. The reminders saved me from late payment fees.",
      rating: 5
    },
    {
      name: "Sofia Reyes",
      role: "Teacher",
      text: "Simple, intuitive, and effective. Perfect for anyone who wants to save money.",
      rating: 5
    }
  ], []);

  // Memoized pricing features
  const pricingFeatures = useMemo(() => [
    "Unlimited income & expense tracking",
    "Bill management & reminders",
    "Detailed financial reports",
    "Category customization",
    "Data export capabilities",
    "Mobile-responsive design"
  ], []);

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-blue-50 to-green-50 flex flex-col">

      {/* Floating Blob Background */}
      <div className="absolute top-20 left-10 w-56 h-56 bg-blue-300/30 rounded-full blur-3xl blob"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-300/20 rounded-full blur-2xl blob"></div>
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl blob" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex justify-between items-center px-6 lg:px-8 py-6 fade-up z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center shadow-md">
            <Wallet size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">Finance App</h1>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleNavigate("/login")}
            className="px-4 py-2 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigate("/register")}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 fade-up mt-10 z-10">
        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          🎉 Trusted by many Filipinos
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 max-w-4xl">
          Take Control of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">Financial Future</span>
        </h2>

        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mb-8">
          Track your income, expenses, and bills easily. Plan your budget and save smarter with powerful insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={() => handleNavigate("/register")}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition flex items-center gap-2 justify-center"
          >
            Get Started Free <ArrowRight size={20} />
          </button>
          <button
            onClick={() => handleNavigate("/login")}
            className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-semibold"
          >
            Login
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">No credit card required • Free forever</p>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 fade-up z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 fade-up z-10">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Manage Money
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple yet powerful tools to help you achieve financial wellness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-md hover:shadow-xl transition hover:-translate-y-1"
            >
              <div className={`p-4 bg-${f.color}-50 rounded-xl mb-4 mx-auto w-fit`}>
                <f.icon size={28} className={`text-${f.color}-600`} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{f.title}</h3>
              <p className="text-gray-600 text-sm text-center">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 fade-up">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Finance App?
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Built with your financial success in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl hover:bg-gray-50 transition">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <benefit.icon size={24} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 fade-up">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started in 3 Simple Steps
          </h3>
          <p className="text-gray-600 text-lg">Start managing your finances in minutes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[ 
            { step: "1", title: "Create Account", desc: "Sign up for free in less than 30 seconds" },
            { step: "2", title: "Add Your Data", desc: "Start tracking income, expenses, and bills" },
            { step: "3", title: "Get Insights", desc: "View reports and achieve your financial goals" }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                {item.step}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 fade-up">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h3>
            <p className="text-gray-600 text-lg">Join thousands of satisfied users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={18} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 fade-up">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h3>
          <p className="text-gray-600 text-lg">100% Free. No hidden fees. Ever.</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h4>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-gray-900">₱0</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {pricingFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleNavigate("/register")}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:scale-105 transition shadow-lg"
            >
              Start Free Today
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-green-500 py-20 text-white text-center fade-up">
        <div className="max-w-4xl mx-auto px-6">
          <Users size={48} className="mx-auto mb-4" />
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to take control?</h3>
          <p className="mb-8 text-lg md:text-xl">
            Join thousands of Filipinos managing their finances smarter and easier every day.
          </p>
          <button
            onClick={() => handleNavigate("/register")}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:scale-105 transition inline-flex items-center gap-2"
          >
            Start Now - It's Free <ArrowRight size={20} />
          </button>
          <p className="text-sm mt-4 text-blue-100">No credit card required • Get started in 30 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="mb-2">
            © 2025 Lemon Sandicho. Built with React, Tailwind CSS and Firebase.
          </p>
          <p className="text-sm">
            Crafted with passion and attention to detail.
          </p>
        </div>
      </footer>
    </div>
  );
}
