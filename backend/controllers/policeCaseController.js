import PoliceCase from '../models/policeCaseModel.js';

export const fileCase = async (req, res) => {
  try {
    const {
      caseNumber,
      reportingOfficer,
      badgeNumber,
      dateTime,
      location,
      incidentType,
      victimName,
      victimContactInfo,
      description,
      additionalInfo,
      status,
      priority
    } = req.body;

    console.log("📥 Form data:", req.body);
    console.log("📸 Uploaded files:", req.files);

    // Get URLs from all uploaded files (if any)
    const mediaURLs = req.files ? req.files.map(file => file.path) : [];

    // Required fields check
    if (
      !caseNumber ||
      !reportingOfficer ||
      !badgeNumber ||
      !dateTime ||
      !location ||
      !incidentType ||
      !victimName ||
      !victimContactInfo
    ) {
      return res.status(400).json({
        error: 'Missing required fields: caseNumber, officer details, dateTime, location, incidentType, victim info'
      });
    }

    // Create new case document
    const newCase = await PoliceCase.create({
      caseNumber,
      reportingOfficer,
      badgeNumber,
      dateTime,
      location,
      incidentType,
      victimName,
      victimContactInfo,
      description,
      media: mediaURLs, // Save all Cloudinary URLs in the media field
      additionalInfo,
      status,
      priority
    });

    res.status(201).json({
      message: 'Case filed successfully',
      case: newCase,
    });

  } catch (error) {
    console.error("❌ Error filing case:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchCases = async (req, res) => {
  const { type, query } = req.query;

  if (!type || !query) {
    return res.status(400).json({ error: 'Please provide both type and query parameters' });
  }

  let searchCriteria = {};

  if (type === 'caseNumber') {
    searchCriteria = { caseNumber: query };
  } else if (type === 'victimName') {
    searchCriteria = { victimName: { $regex: query, $options: 'i' } };
  } else if (type === 'victimContactInfo') {
    searchCriteria = { victimContactInfo: { $regex: query, $options: 'i' } };
  } else {
    return res.status(400).json({ error: 'Invalid search type' });
  }

  try {
    const results = await PoliceCase.find(searchCriteria);
    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Error searching cases:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getOpenCases = async (req, res) => {
  try {
    const openCases = await PoliceCase.find({ status: 'Open' }).limit(4).sort({ dateTime: -1 });
    res.status(200).json(openCases);
  } catch (error) {
    console.error("Error fetching open cases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCases = async (req, res) => {
  try {
    const cases = await PoliceCase.find();
    res.status(200).json(cases);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markAsResolved = async (req, res) => {
  const { caseNumber } = req.body;

  try {
    const caseToUpdate = await PoliceCase.findOne({ caseNumber });

    if (!caseToUpdate) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseToUpdate.status = "Closed";
    await caseToUpdate.save();

    res.status(200).json({ message: "Case marked as Closed", case: caseToUpdate });
  } catch (error) {
    console.error("Error updating case:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCaseByVictimContact = async (req, res) => {
  try {
    const contact = req.query.contact?.trim();

    if (!contact) {
      return res.status(400).json({ message: 'Victim contact info is required.' });
    }

    console.log("🔍 Searching for contact:", contact);

    const cases = await PoliceCase.find({
      victimContactInfo: { $regex: contact, $options: 'i' },
    });

    console.log("🗂️ Cases found:", cases.length);

    return res.status(200).json({ cases });
  } catch (error) {
    console.error('Error fetching cases by victim contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

