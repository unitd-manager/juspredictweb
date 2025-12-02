import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { CardDescription } from '../components/ui/CardDescription';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      // In a real application, this would send data to an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      detail: 'support@juspredicct.com',
      description: 'We typically respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Phone',
      detail: '+1 (555) 123-4567',
      description: 'Mon - Fri, 9am - 6pm EST',
    },
    {
      icon: MapPin,
      title: 'Office',
      detail: 'San Francisco, CA',
      description: '123 Tech Street, Suite 100',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg text-gray-light">
      {/* Page Header */}
      <PageHeader
        title="Contact Us"
        tagline="Get in touch with our team. We'd love to hear from you."
        compact={true}
        isSubpage={true}
      />

      <main className="relative overflow-hidden">
        {/* Contact Info Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid gap-6 lg:grid-cols-3 mb-16">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <Card
                    key={info.title}
                    className="border-white/10 bg-dark-card/70 hover:border-primary/40 transition-all duration-300"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-team-blue/80 text-white">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {info.title}
                          </h3>
                          <p className="text-sm font-medium text-primary mb-2">
                            {info.detail}
                          </p>
                          <CardDescription className="text-xs">
                            {info.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Contact Form Section */}
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
              {/* Left Side - Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Send us a Message
                  </h2>
                  <CardDescription className="text-base">
                    Have a question or feedback? Fill out the form and our team will get back to you as soon as possible. We value your input and look forward to connecting with you.
                  </CardDescription>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-white mb-2">
                      Response Time
                    </p>
                    <CardDescription>
                      We aim to respond to all inquiries within 24 business hours.
                    </CardDescription>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-2">
                      Support Hours
                    </p>
                    <CardDescription>
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday - Sunday: 10:00 AM - 4:00 PM EST
                    </CardDescription>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <Card className="border-white/10 bg-dark-card/70">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-muted mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-dark-bg/80 border-white/10 h-10"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-muted mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-dark-bg/80 border-white/10 h-10"
                      />
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-muted mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        placeholder="What is this about?"
                        value={formData.subject}
                        onChange={handleChange}
                        className="bg-dark-bg/80 border-white/10 h-10"
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-gray-muted mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        placeholder="Your message here..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-muted focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-black hover:bg-primary/90 h-10 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-xs text-gray-muted text-center">
                      We'll respond to your message within 24 hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
