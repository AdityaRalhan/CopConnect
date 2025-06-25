import anonymousTip from "../models/anonymousTipModel.js";
import { v4 as uuidv4 } from 'uuid';


export const fileTip = async (req, res) => {
  try {
    const { description, location } = req.body;

    // Handle uploaded files
    const media = req.files || [];

    if (!description || !location) {
      console.log("description is : ", description);
      console.log("media is : ", media);
      console.log("location is : ", location);
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mediaUrls = media.map(file => file.path || file.url);
    console.log("MEDIA IS :", mediaUrls);

    const anonymousId = uuidv4(); // ✅ generate unique ID for tracking
    console.log("this is the anonymousid we have generated : ", anonymousId);

    const newTip = new anonymousTip({
      description,
      media: mediaUrls,
      location: {
        type: 'Point',
        coordinates: location.split(',').map(Number), // or adjust based on format
      },
      reviewedBy: "",
      badgeNumber: "",
      anonymousId // ✅ add this line
    });

    await newTip.save();

    return res.status(201).json({
      message: 'Tip filed successfully',
      tip: newTip,
      anonymousId // ✅ return the ID so the user can track it
    });
  } catch (error) {
    console.error('Error filing tip:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingTips = async (req, res) => {
  try {
    // Find the first 2 tips with status "pending"
    console.log("Fetching pending tips...");
    const tips = await anonymousTip.find({ status: "Pending" }).limit(4);

    if (!tips.length) {
      return res.status(200).json({ tips: [] }); // ← consistent response structure
    }

    return res.status(200).json({ tips });
  } catch (error) {
    console.error("Error fetching pending tips:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTipById = async (req, res) => {
  try {
    const { id } = req.params;

    const tip = await anonymousTip.findById(id);

    if (!tip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    return res.status(200).json(tip);

  } catch (error) {
    console.error("Error fetching tip by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const markTipAsReviewed = async (req, res) => {
  const { id } = req.params;
  const { status, reviewedBy, badgeNumber } = req.body;


  try {
    const updatedTip = await anonymousTip.findByIdAndUpdate(
      id,
      {
        status: "Reviewed",
        reviewedBy: reviewedBy,
        badgeNumber: badgeNumber
      },
      { new: true }
    );

    if (!updatedTip) {
      return res.status(404).json({ message: "Tip not found" });
    }

    res.status(200).json(updatedTip);
  } catch (error) {
    console.error("Failed to update tip status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTipsByAnonymousId = async (req, res) => {
  const { anonymousId } = req.params;

  try {
    // console.log("this is the anonymous id the controller has received : ", anonymousId);
    const tips = await anonymousTip.find({ anonymousId });

    if (!tips.length) {
      return res.status(404).json({ message: "No tips found for this ID" });
    }

    res.status(200).json({ tips });
  } catch (error) {
    console.error("Error fetching tips:", error);
    res.status(500).json({ message: "Server error" });
  }
};
