const { Types } = require("mongoose");
const Card = require("../models/cardModel");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Get a reference to the Firebase storage
const storage = getStorage();

exports.CardService = {
  // Retrieve all cards
  getAllCards: async function (name) {
    let query = name;
    if (!query) {
      query = {};
    }
    const cards = await Card.find(query);
    return cards;
  },

  // Get a card by ID
  getCardById: async function (id) {
    const card = await Card.findOne({ _id: new Types.ObjectId(id) });
    return card;
  },

  // Create a new card
  createCard: async function (req, res) {
    const now = new Date().getMinutes();
    const mimeType = req.file.mimetype.split("/")[0];
    console.log(mimeType);

    const storageRef = ref(
      storage,
      `files/${req.file.originalname + " - " + now}`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file to the storage bucket
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    // By using uploadBytesResumable, we can control the progress of uploading like pause, resume, cancel

    // Get the public URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const data = req.body;
    data.setId = new Types.ObjectId(data.setId);
    data.mimeType = mimeType;
    data.fileUrl = downloadURL;

    // Create a new card in the database
    const newCard = await Card.create({
      ...data,
      meanings: JSON.parse(data?.meanings[0]),
    });

    return newCard;
  },

  // Update a card by ID
  updateCard: async function (id, data) {
    const card = await Card.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      data
    );
    return card;
  },

  // Delete a card by ID
  deleteCardById: async function (id) {
    const card = await Card.findByIdAndDelete(id);
    return card;
  },

  // Retrieve cards by set ID
  getCardsBySet: async function (id) {
    const cards = await Card.find({ setId: id });
    return cards;
  },
};
