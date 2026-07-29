export const analyzeResume = async (req, res) => {
  try {
    res.json({
      message: "Resume analyzer API working"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};