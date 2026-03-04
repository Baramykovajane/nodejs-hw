
import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 15,
    tag,
    search,
  } = req.query;

  const currentPage = Number(page);
  const currentPerPage = Number(perPage);

  const skip = (currentPage - 1) * currentPerPage;

  const filter = {
    userId: req.user._id,
  };

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    Note.find(filter)
      .skip(skip)
      .limit(currentPerPage)
      .sort({ _id: -1 }),
  ]);

  const totalPages = Math.ceil(totalNotes / currentPerPage);

  res.status(200).json({
    page: currentPage,
    perPage: currentPerPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// GET /notes/:noteId
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

   const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// POST /notes
export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(note);
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// PATCH /notes/:noteId
export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    { new: true }
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
