import Voter from "../../models/Voter.model.js";

export async function getVotersElection(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find voter and populate election title
    const voter = await Voter.findOne({ email })
      .populate("election", "title"); // only fetch title

    if (!voter) {
      return res.status(404).json({
        success: false,
        message: "Voter not found"
      });
    }

    return res.status(200).json({
      success: true,
      electionTitle: voter.election.title
    });

  } catch (error) {
    console.error("Error fetching voter's election:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}
