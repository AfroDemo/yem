import { useEffect, useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function RequestMentorshipPage() {
  const { mentorId } = useParams();
  const [selectedPackage, setSelectedPackage] = useState("starter");
  const [requestStatus, setRequestStatus] = useState("draft");
  const [mentorData, setMentorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    goals: "",
    background: "",
    expectations: "",
    availability: "",
    timezone: "",
  });
  const user = useUser();

  const mentorshipPackages = [
    {
      id: "starter",
      title: "Starter Package",
      sessions: "2 sessions per month",
      duration: "45 minutes each",
      communication: "Email support between sessions",
      price: "Free for platform members",
    },
    {
      id: "growth",
      title: "Growth Package",
      sessions: "4 sessions per month",
      duration: "60 minutes each",
      communication: "Email and chat support",
      price: "Free for platform members",
    },
  ];

  const getMentorById = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${mentorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMentorData(response.data);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMentorById();
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the complete submission data
    const submissionData = {
      menteeId: user.id,
      mentorId,
      mentorName: `${mentorData.firstName} ${mentorData.lastName}`,
      selectedPackage,
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    try {
      console.log(submissionData)
      await api.post("/mentorships", submissionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Mentorship Request sent!");
      setRequestStatus("submitted");
    } catch (error) {
      toast.error("Mentorship Request failed");
    }
  };

  if (requestStatus === "submitted") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <Link
              href="/dashboard/mentors"
              className="flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </button>
          <h1 className="text-3xl font-bold">Request Submitted</h1>
        </div>

        <div className="max-w-2xl mx-auto rounded-lg border bg-white shadow-sm">
          <div className="p-6 pt-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Mentorship Request Sent!
            </h2>
            <p className="text-gray-500 mb-6">
              Your request has been sent to {mentorData.name}. You'll receive a
              notification when they respond.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg w-full mb-6">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="space-y-2 text-sm text-left">
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    1
                  </span>
                  <span className="flex-1 pt-1">
                    {mentorData.name} will review your request (typically within
                    2-3 business days)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    2
                  </span>
                  <span className="flex-1 pt-1">
                    If accepted, you'll be able to schedule your first mentoring
                    session
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    3
                  </span>
                  <span className="flex-1 pt-1">
                    You'll receive an email with next steps and preparation
                    guidelines
                  </span>
                </li>
              </ol>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <Link href="/dashboard/mentors">Browse More Mentors</Link>
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
                <Link href="/dashboard/mentors/requests">View My Requests</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !mentorData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requestStatus === "submitted") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <Link
              href="/dashboard/mentors"
              className="flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </button>
          <h1 className="text-3xl font-bold">Request Submitted</h1>
        </div>

        <div className="max-w-2xl mx-auto rounded-lg border bg-white shadow-sm">
          <div className="p-6 pt-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Mentorship Request Sent!
            </h2>
            <p className="text-gray-500 mb-6">
              Your request has been sent to {mentorData?.firstName}. You'll
              receive a notification when they respond.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg w-full mb-6">
              <h3 className="font-medium mb-2">What happens next?</h3>
              <ol className="space-y-2 text-sm text-left">
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    1
                  </span>
                  <span className="flex-1 pt-1">
                    {mentorData?.firstName} will review your request (typically
                    within 2-3 business days)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    2
                  </span>
                  <span className="flex-1 pt-1">
                    If accepted, you'll be able to schedule your first mentoring
                    session
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                    3
                  </span>
                  <span className="flex-1 pt-1">
                    You'll receive an email with next steps and preparation
                    guidelines
                  </span>
                </li>
              </ol>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <Link href="/dashboard/mentors">Browse More Mentors</Link>
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
                <Link href="/dashboard/mentors/requests">View My Requests</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
          <Link to={`/dashboard/mentors/${mentorId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </button>
        <h1 className="text-3xl font-bold">Request Mentorship</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Mentorship Request</h2>
                <p className="text-gray-500">
                  Tell {mentorData.firstName} about yourself and your goals
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={mentorData.profileImage}
                      alt={mentorData.firstName}
                      className="h-full w-full object-cover"
                    />
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      {mentorData.firstName.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{mentorData.firstName}</h3>
                    <p className="text-sm text-gray-500">
                      {mentorData.role} • {mentorData.industry}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Select Mentorship Package
                  </label>
                  <div className="space-y-3">
                    {mentorshipPackages.map((pkg) => (
                      <div key={pkg.id} className="flex items-start space-x-3">
                        <input
                          type="radio"
                          value={pkg.id}
                          id={pkg.id}
                          checked={selectedPackage === pkg.id}
                          onChange={() => setSelectedPackage(pkg.id)}
                          className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="grid gap-1.5 leading-none w-full">
                          <label
                            htmlFor={pkg.id}
                            className="text-base font-medium cursor-pointer"
                          >
                            {pkg.title}
                          </label>
                          <div className="border rounded-md p-3 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="font-medium">Sessions</p>
                                <p className="text-gray-500">{pkg.sessions}</p>
                              </div>
                              <div>
                                <p className="font-medium">Duration</p>
                                <p className="text-gray-500">{pkg.duration}</p>
                              </div>
                              <div>
                                <p className="font-medium">Communication</p>
                                <p className="text-gray-500">
                                  {pkg.communication}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium">Price</p>
                                <p className="text-gray-500">{pkg.price}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="goals"
                      className="text-sm font-medium leading-none"
                    >
                      Your Goals for Mentorship
                    </label>
                    <div className="group relative">
                      <Info className="h-4 w-4 text-gray-400" />
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 bg-white border rounded-md shadow-lg">
                        <p>
                          Be specific about what you hope to achieve through
                          mentorship. This helps your mentor prepare and tailor
                          their guidance.
                        </p>
                      </div>
                    </div>
                  </div>
                  <textarea
                    id="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    placeholder="What specific goals do you want to achieve with this mentor? What challenges are you facing?"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="background"
                    className="text-sm font-medium leading-none"
                  >
                    Your Background
                  </label>
                  <textarea
                    id="background"
                    value={formData.background}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your business, experience, and current stage."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="expectations"
                    className="text-sm font-medium leading-none"
                  >
                    Your Expectations
                  </label>
                  <textarea
                    id="expectations"
                    value={formData.expectations}
                    onChange={handleInputChange}
                    placeholder="What do you expect from this mentorship relationship? How do you prefer to work with a mentor?"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="availability"
                    className="text-sm font-medium leading-none"
                  >
                    Your Availability
                  </label>
                  <select
                    id="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select your availability</option>
                    <option value="weekdays">Weekdays (9am-5pm)</option>
                    <option value="evenings">Evenings (after 5pm)</option>
                    <option value="weekends">Weekends</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="timezone"
                    className="text-sm font-medium leading-none"
                  >
                    Your Timezone
                  </label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {/* Africa */}
                    <optgroup label="Africa">
                      <option value="cat">
                        Central Africa Time (CAT, UTC+2)
                      </option>
                      <option value="eat">East Africa Time (EAT, UTC+3)</option>
                      <option value="wat">West Africa Time (WAT, UTC+1)</option>
                      <option value="sast">
                        South Africa Standard Time (SAST, UTC+2)
                      </option>
                    </optgroup>

                    {/* Americas */}
                    <optgroup label="Americas">
                      <option value="pt">Pacific Time (PT, UTC-8/-7)</option>
                      <option value="mt">Mountain Time (MT, UTC-7/-6)</option>
                      <option value="ct">Central Time (CT, UTC-6/-5)</option>
                      <option value="et">Eastern Time (ET, UTC-5/-4)</option>
                    </optgroup>

                    {/* Europe */}
                    <optgroup label="Europe">
                      <option value="gmt">
                        Greenwich Mean Time (GMT, UTC+0)
                      </option>
                      <option value="cet">
                        Central European Time (CET, UTC+1)
                      </option>
                      <option value="eet">
                        Eastern European Time (EET, UTC+2)
                      </option>
                    </optgroup>

                    {/* Asia */}
                    <optgroup label="Asia">
                      <option value="ist">
                        India Standard Time (IST, UTC+5:30)
                      </option>
                      <option value="jst">
                        Japan Standard Time (JST, UTC+9)
                      </option>
                      <option value="cst">
                        China Standard Time (CST, UTC+8)
                      </option>
                    </optgroup>

                    {/* Australia */}
                    <optgroup label="Australia">
                      <option value="aest">
                        Australian Eastern (AEST, UTC+10)
                      </option>
                      <option value="acst">
                        Australian Central (ACST, UTC+9:30)
                      </option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t flex flex-col sm:flex-row gap-3">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 sm:flex-1">
                  <Link to="/dashboard/mentors">Cancel</Link>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 sm:flex-1"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Request Tips</h2>
              <p className="text-gray-500">How to make a great impression</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Be Specific</h4>
                <p className="text-sm text-gray-500">
                  Clearly outline your goals and challenges. Specific requests
                  are more likely to be accepted.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Show Commitment</h4>
                <p className="text-sm text-gray-500">
                  Demonstrate that you're serious about the mentorship and
                  willing to put in the work.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Be Authentic</h4>
                <p className="text-sm text-gray-500">
                  Share your genuine challenges and aspirations. Authenticity
                  helps build a stronger connection.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Respect Their Time</h4>
                <p className="text-sm text-gray-500">
                  Be clear about your availability and commitment to scheduled
                  sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">What to Expect</h2>
              <p className="text-gray-500">The mentorship process</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Request Review</h4>
                  <p className="text-sm text-gray-500">
                    Mentor reviews your request (2-3 days)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Initial Meeting</h4>
                  <p className="text-sm text-gray-500">
                    Introductory call to align expectations
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Regular Sessions</h4>
                  <p className="text-sm text-gray-500">
                    Ongoing mentorship based on your package
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  4
                </div>
                <div>
                  <h4 className="font-medium">Progress Tracking</h4>
                  <p className="text-sm text-gray-500">
                    Regular check-ins on goal achievement
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Need Help?</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                If you have questions about the mentorship process or need
                assistance with your request, our team is here to help.
              </p>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
