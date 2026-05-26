import Metric from '../models/Metric.js';
import ExpertisePillar from '../models/ExpertisePillar.js';
import SiteSettings from '../models/SiteSettings.js';
import WaitlistEntry from '../models/WaitlistEntry.js';
import { sendWaitlistConfirmationEmail } from '../services/resendService.js';
import { Readable } from 'node:stream';

// ─── METRICS ───────────────────────────────────────────────────────────────

export const getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ order: 1 });
    res.json(metrics);
  } catch (error) {
    console.error('ContentController.getMetrics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMetric = async (req, res) => {
  try {
    const metric = await Metric.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!metric) return res.status(404).json({ message: 'Metric not found' });
    res.json(metric);
  } catch (error) {
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

// ─── EXPERTISE PILLARS ─────────────────────────────────────────────────────

export const getExpertise = async (req, res) => {
  try {
    const pillars = await ExpertisePillar.find({ isVisible: true }).sort({ order: 1 });
    res.json(pillars);
  } catch (error) {
    console.error('ContentController.getExpertise error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllExpertise = async (req, res) => {
  try {
    const pillars = await ExpertisePillar.find().sort({ order: 1 });
    res.json(pillars);
  } catch (error) {
    console.error('ContentController.getAllExpertise error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createExpertisePillar = async (req, res) => {
  try {
    const pillar = await ExpertisePillar.create(req.body);
    res.status(201).json(pillar);
  } catch (error) {
    console.error('ContentController.createExpertisePillar error:', error);
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

export const updateExpertisePillar = async (req, res) => {
  try {
    const pillar = await ExpertisePillar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pillar) return res.status(404).json({ message: 'Pillar not found' });
    res.json(pillar);
  } catch (error) {
    console.error('ContentController.updateExpertisePillar error:', error);
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

export const deleteExpertisePillar = async (req, res) => {
  try {
    const pillar = await ExpertisePillar.findByIdAndDelete(req.params.id);
    if (!pillar) return res.status(404).json({ message: 'Pillar not found' });
    res.json({ message: 'Pillar deleted successfully' });
  } catch (error) {
    console.error('ContentController.deleteExpertisePillar error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── SITE SETTINGS (SINGLETON) ─────────────────────────────────────────────

// GET — Fetch the single settings document
export const getSettings = async (req, res) => {
  try {
    // findOne() with no filter returns whatever document exists
    let settings = await SiteSettings.findOne();

    // If no settings exist yet, create defaults automatically
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error('ContentController.getSettings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT — Update the single settings document
export const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      // findOneAndUpdate with upsert:true means "update if exists, create if not"
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

// ─── WAITLIST ──────────────────────────────────────────────────────────────

// POST /api/waitlist — Public: submit email to waitlist
export const joinWaitlist = async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    // Prevent duplicate entries
    const existing = await WaitlistEntry.findOne({ email });
    const settings = await SiteSettings.findOne();
    const bookTitle = settings?.book?.title || 'Success Leaves Cues';

    let entry = existing;
    if (!existing) {
      entry = await WaitlistEntry.create({ email, name });
    }

    let emailSent = false;
    try {
      const result = await sendWaitlistConfirmationEmail({ email, name, bookTitle });
      emailSent = Boolean(result?.sent);
    } catch (emailError) {
      console.error('Resend waitlist email error:', emailError);
    }

    res.status(existing ? 200 : 201).json({
      message: existing ? "You're already on the waitlist!" : "You're on the waitlist!",
      entry,
      emailSent,
    });
  } catch (error) {
    console.error('ContentController.joinWaitlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/admin/waitlist — Admin only: view all entries
export const getWaitlist = async (req, res) => {
  try {
    const entries = await WaitlistEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('ContentController.getWaitlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const serveCv = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    const cvUrl = settings?.hero?.cvUrl;

    if (!cvUrl) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const response = await fetch(cvUrl);
    if (!response.ok || !response.body) {
      return res.status(502).json({ message: 'Failed to fetch CV file' });
    }

    const filename = "Favor Odedele's CV.pdf";
    const encodedFilename = encodeURIComponent(filename).replace(/[!'()*]/g, (char) =>
      `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    );
    const wantsDownload = req.query.download === '1' || req.query.download === 'true';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader(
      'Content-Disposition',
      `${wantsDownload ? 'attachment' : 'inline'}; filename="${filename}"; filename*=UTF-8''${encodedFilename}`
    );

    const stream = Readable.fromWeb(response.body);
    stream.pipe(res);
  } catch (error) {
    console.error('ContentController.serveCv error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
