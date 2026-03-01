import Project from '../models/Project.js';

// ─── PUBLIC ────────────────────────────────────────────────────────────────

// GET /api/projects — Returns only visible projects, sorted by order
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isVisible: true }).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    console.error('ProjectController.getProjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── ADMIN ─────────────────────────────────────────────────────────────────

// GET /api/admin/projects — Returns ALL projects (including hidden)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    console.error('ProjectController.getAllProjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/admin/projects — Create a new project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('ProjectController.createProject error:', error);
    res.status(400).json({ message: 'Validation error', error: error.message });
  }
};

// PUT /api/admin/projects/:id — Update a project by its MongoDB ID
export const updateProject = async (req, res) => {
  try {
    // findByIdAndUpdate finds the document, applies changes, and returns the updated version
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,       // Return the updated document (not the old one)
      runValidators: true, // Re-run schema validations on update
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('ProjectController.updateProject error:', error);
    res.status(400).json({ message: 'Update error', error: error.message });
  }
};

// DELETE /api/admin/projects/:id — Permanently delete
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('ProjectController.deleteProject error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
