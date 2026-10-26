
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
    isAiGen: {
      type: Boolean,
      require: true
    },
    mediaItems: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],

    platforms: {
      type: [
        {
          type: String,
          enum: [
            "instagram",
            "linkedin",
            "facebook",
            "twitter",
          ],
        },
      ],
      required: true,
      validate: {
        validator: (value) => value.length > 0,
        message: "At least one platform is required.",
      },
    },

    scheduledFor: {
      type: Date,
      default: null,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    postId: {
      type: String,
      default: null,
      index: true,
    },

    status: {
      type: String,
      default: "draft",
    }, platformResults: [
      {
        platform: {
          type: String,
          required: true,
        },
        platformPostId: {
          type: String,
          default: null,
        },
        platformPostUrl: {
          type: String,
          default: null,
        },
        status: {
          type: String,
          default: "pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
