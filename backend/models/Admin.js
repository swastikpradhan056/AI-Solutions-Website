const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Pre-save hook to hash the password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Function to create the default admin
adminSchema.statics.createDefaultAdmin = async function () {
  const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
  const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    console.error(
      "Error: Default admin credentials are not set in environment variables."
    );
    return;
  }

  try {
    const existingAdmin = await this.findOne({ email: DEFAULT_ADMIN_EMAIL });
    if (!existingAdmin) {
      const admin = new this({
        name: "Super Admin",
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD, // Plain text password, let the pre-save hook hash it
      });
      await admin.save();
      console.log("Default admin account created.");
    } else {
      console.log("Default admin already exists.");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
};

module.exports = mongoose.model("Admin", adminSchema);
