const Career = require("../models/Career");

exports.saveCareer = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = {
      userId,
      ...req.body,
    };

    if (req.file) {
      data.resumeUrl = `/uploads/${req.file.filename}`;
    }

    const existing = await Career.findOne({ userId });

    if (existing) {
      const updated = await Career.findOneAndUpdate(
        { userId },
        data,
        { new: true }
      );
      return res.json(updated);
    }

    const career = new Career(data);
    await career.save();
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCareer = async (req, res) => {
  try {
    const career = await Career.findOne({ userId: req.user.id });
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
