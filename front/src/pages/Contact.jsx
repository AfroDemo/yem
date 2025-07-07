import React, { useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Contact form submitted");
    setFormSubmitted(true);
  };

  const handleClose = () => {
    setFormSubmitted(false);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">
            We'd love to hear from you. Reach out with questions, feedback, or
            partnership opportunities.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Contact Information
              </h2>
              <p className="text-lg text-gray-600">
                Reach out to us through any of these channels
              </p>
            </div>

            <div className="space-y-8">
              {/* Contact Items */}
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <a href="mailto:info@youthmentorship.org">
                      info@youthmentorship.org
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
                  <PhoneIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600 hover:text-blue-600 transition-colors">
                    <a href="tel:+255766768846">+255 766-768-846</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-3 rounded-lg">
                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Office
                  </h3>
                  <address className="mt-1 not-italic text-gray-600">
                    123 CCM Iyunga
                    <br />
                    Mageuzi
                    <br />
                    Mbeya, Tanzania
                  </address>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            {/* Office Hours */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Office Hours
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Weekdays</p>
                  <p className="text-gray-600">Monday - Friday</p>
                  <p className="text-blue-600 font-medium mt-1">
                    9:00 AM - 5:00 PM
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">Saturday</p>
                  <p className="text-gray-600">Weekend</p>
                  <p className="text-blue-600 font-medium mt-1">
                    10:00 AM - 2:00 PM
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                  <p className="font-medium text-gray-900">Sunday</p>
                  <p className="text-gray-600">Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-center text-gray-600 mb-8">
            Find quick answers to common questions about our mentorship
            platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  How do I apply to be a mentee?
                </h3>
                <p className="text-gray-600">
                  You can apply to be a mentee by creating an account and
                  completing the mentee application form. Our team will review
                  your application and match you with a suitable mentor based on
                  your goals and interests.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  What are the requirements to become a mentor?
                </h3>
                <p className="text-gray-600">
                  Mentors should have at least 5 years of experience in their
                  field, a passion for helping young entrepreneurs, and the
                  ability to commit to regular mentoring sessions. You can apply
                  through our "Become a Mentor" page.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Is there a cost to join the platform?
                </h3>
                <p className="text-gray-600">
                  Our basic mentorship matching service is free for mentees. We
                  also offer premium programs with additional resources and
                  benefits for a monthly subscription fee. All details are
                  available on our pricing page.
                </p>
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  How often do mentors and mentees meet?
                </h3>
                <p className="text-gray-600">
                  The frequency of meetings is determined by the mentor and
                  mentee based on their availability and goals. Typically, pairs
                  meet bi-weekly or monthly for 1-2 hours, with additional
                  communication as needed.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  Can I change my mentor if it's not a good fit?
                </h3>
                <p className="text-gray-600">
                  Yes, we understand that not every match will be perfect. If
                  you feel your mentor is not a good fit, you can request a new
                  match through your dashboard, and our team will work to find a
                  more suitable mentor.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">
                  How can organizations partner with your platform?
                </h3>
                <p className="text-gray-600">
                  We welcome partnerships with organizations that support youth
                  entrepreneurship. Please contact us through the form on this
                  page with details about your organization and partnership
                  ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {formSubmitted && (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end">
          <div className="max-w-sm w-full bg-green-50 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">Success!</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Your message has been sent successfully! We'll get back to
                    you soon.
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
