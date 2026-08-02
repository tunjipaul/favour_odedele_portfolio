import SiteSettings from '../models/SiteSettings.js';
import WaitlistEntry from '../models/WaitlistEntry.js';
import { sendWaitlistConfirmationEmail } from '../services/resendService.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error('ContentController.getSettings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      settings = await SiteSettings.findOneAndUpdate({}, req.body, {
        new: true,
        runValidators: true,
        upsert: true,
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('ContentController.updateSettings error:', error);
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

export const joinWaitlist = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const existing = await WaitlistEntry.findOne({ email });
    const settings = await SiteSettings.findOne();
    const bookTitle = settings?.book?.title || 'Becoming the 1%';

    let entry = existing;
    if (!existing) {
      entry = await WaitlistEntry.create({ email, name });
    }

    let emailSent = false;
    try {
      const result = await sendWaitlistConfirmationEmail({ email, name, bookTitle });
      emailSent = Boolean(result?.sent);
    } catch (emailError) {
      console.error('Resend community email error:', emailError);
    }

    res.status(existing ? 200 : 201).json({
      message: existing ? "You're already in the community." : "You're in. Welcome to the community.",
      entry,
      emailSent,
    });
  } catch (error) {
    console.error('ContentController.joinWaitlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWaitlist = async (req, res) => {
  try {
    const entries = await WaitlistEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('ContentController.getWaitlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
