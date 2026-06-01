const mongoose = require('mongoose');

const projectCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tags: [String],
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: String, required: true },
  bannerImg: { type: String, required: true },
  img: { type: String, required: true }, 
  cat: { type: String, required: true }, 
  mainHeadingStart: { type: String, required: true },
  mainHeadingMute: { type: String, required: true },
  mainHeadingEnd: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String },
  categories: [projectCategorySchema],
  gallery: [String],
  video: { type: String }, // Store video path as string (acts as boolean if present)
  videoHeading: { type: String },
  videoThumb: { type: String },
  featured: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
