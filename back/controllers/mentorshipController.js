const db = require("../models");
const User = db.User;
const Mentorship = db.Mentorship;

// Create mentorship request
exports.createMentorship = async (req, res) => {
  try {
    const {
      mentorId,
      menteeId,
      selectedPackage,
      goals,
      background,
      expectations,
      availability,
      timezone,
    } = req.body;

    // Validate mentor exists
    const mentor = await User.findByPk(mentorId);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Check for existing pending request
    const existingRequest = await Mentorship.findOne({
      where: {
        mentorId,
        menteeId,
        status: "pending",
      },
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "You already have a pending request with this mentor" });
    }

    const newRequest = await Mentorship.create({
      mentorId,
      menteeId,
      packageType: selectedPackage,
      goals,
      background,
      expectations,
      availability,
      timezone: timezone.toLowerCase(),
      status: "pending",
    });

    // Include mentor details in the response
    const response = await Mentorship.findByPk(newRequest.id, {
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
    });

    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating mentorship request:", error);
    res.status(500).json({ error: "Failed to create mentorship request" });
  }
};

// Get all requests for a mentor
exports.getMentorRequests = async (req, res) => {
  try {
    const mentorId = req.user.id; // Assuming authenticated user is the mentor

    const requests = await Mentorship.findAll({
      where: { mentorId },
      include: [
        {
          model: User,
          as: "mentee",
          attributes: { exclude: ["password"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching mentor requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Get all requests for a mentee
exports.getMenteeRequests = async (req, res) => {
  try {
    const menteeId = req.user.id; // Assuming authenticated user is the mentee

    const requests = await Mentorship.findAll({
      where: { menteeId },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: { exclude: ["password"] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching mentee requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// Update request status (accept/reject)
exports.updateMentorshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completedAt } = req.body;
    const mentorId = req.user.id; // Authenticated user must be the mentor

    if (!["accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    const request = await Mentorship.findOne({
      where: {
        id,
        mentorId,
      },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Allow updating from accepted to completed
    if (
      request.status !== "pending" &&
      !(request.status === "accepted" && status === "completed")
    ) {
      return res
        .status(400)
        .json({ error: "Request status cannot be changed" });
    }

    // Prepare update object based on status
    const updateData = { status };

    if (status === "accepted") {
      updateData.startDate = new Date();
      updateData.meetingFrequency =
        request.packageType === "starter"
          ? "2 sessions/month"
          : "4 sessions/month";
    } else if (status === "completed") {
      updateData.completedAt = completedAt || new Date();
    }

    const updatedRequest = await request.update(updateData);

    res.json(updatedRequest);
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Failed to update request" });
  }
};

// Get request details
exports.getRequestDetails = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id; // Authenticated user

    const request = await Mentorship.findOne({
      where: {
        id: requestId,
        [Op.or]: [{ mentorId: userId }, { menteeId: userId }],
      },
      include: [
        {
          model: User,
          as: "mentor",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
        {
          model: User,
          as: "mentee",
          attributes: ["id", "firstName", "lastName", "profileImage"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json(request);
  } catch (error) {
    console.error("Error fetching request details:", error);
    res.status(500).json({ error: "Failed to fetch request details" });
  }
};
