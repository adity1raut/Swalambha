import mongoose from "mongoose";

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true
    },

    hasVoted: {
      type: Boolean,
      default: false
    },

    isCandidate: {
      type: Boolean,
      default: false
    },
    
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

voterSchema.index({ email: 1, electionId: 1 }, { unique: true });

export default mongoose.model("Voter", voterSchema);
