import TestAttempt from "../../models/TestAttempt.js";

// Save a new attempt
export const saveAttempt = async (req, res) => {
  try {
    const attempt = new TestAttempt(req.body);
    const savedAttempt = await attempt.save();

    res.status(201).json({
      success: true,
      message: "Test attempt saved successfully",
      data: savedAttempt,
    });
  } catch (error) {
    console.error("Save Attempt Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save test attempt",
      error: error.message,
    });
  }
};

// Get all attempts
export const getAllAttempts = async (req, res) => {
  try {
    const attempts = await TestAttempt.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    console.error("Get Attempts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attempts",
      error: error.message,
    });
  }
};

// Get attempt by ID
export const getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await TestAttempt.findById(attemptId);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    console.error("Get Attempt Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch attempt",
      error: error.message,
    });
  }

  
};

export const getLeaderboard = async (req, res) => {
  try {

    const leaderboard = await TestAttempt.aggregate([
      {
        $sort: {
          score: -1
        }
      },
      {
        $group: {
          _id: "$user",
          bestScore: {
            $first: "$score"
          },
          topic: {
            $first: "$topic"
          },
          createdAt: {
            $first: "$createdAt"
          }
        }
      },
      {
        $sort: {
          bestScore: -1
        }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          email: "$user.email",
          score: "$bestScore",
          topic: 1,
          createdAt: 1
        }
      }
    ]);


    res.status(200).json(leaderboard);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};