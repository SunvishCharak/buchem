import CustomBox from "../models/customModel.js";

// Function to save custom box data
const saveCustomBox = async (req, res) => {
  try {

    console.log("🔥 Saving Data:", req.body); // Debugging log

    const newCustomBox = new CustomBox({
      fields: req.body,
    });

    await newCustomBox.save();
    console.log(" Data Saved to MongoDB");
    
    res.status(201).json({ success: true, message: "Custom request saved successfully" });
  } catch (error) {
    console.error("Error saving custom request:", error);
    res.status(500).json({ success: false, message: "Error saving custom request", error: error.message });
  }
};

// Function to get all custom requests
const getCustomBoxes = async (req, res) => {
  try {
    const customRequests = await CustomBox.find().sort({ createdAt: -1 });
    res.json({ success: true, customRequests });
  } catch (error) {
    console.error("Error fetching custom requests:", error);
    res.status(500).json({ success: false, message: "Error fetching custom requests", error: error.message });
  }
};

export { saveCustomBox, getCustomBoxes };
