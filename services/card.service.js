const { Types } = require("mongoose");
const Card = require("../models/cardModel");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyBzUSVGJnNVhJGUqXBVg1i73jODq92Z0TA",
  authDomain: "flashcard-uploads.firebaseapp.com",
  projectId: "flashcard-uploads",
  storageBucket: "flashcard-uploads.appspot.com",
  messagingSenderId: "58873052864",
  appId: "1:58873052864:web:f10a52d712e2f72438f725",
  measurementId: "G-HG5SXFN18Y",
};

initializeApp(firebaseConfig);

const storage = getStorage();

exports.CardService = {
  getAllCards: async function (name) {
    let query = name;
    if (!query) {
      query = {};
    }
    const cards = await Card.find(query);
    return cards;
  },

  getCardById: async function (id) {
    const card = await Card.findOne({ _id: new Types.ObjectId(id) });
    return card;
  },

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

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");

    const data = req.body;
    data.setId = new Types.ObjectId(data.setId);
    data.mimeType = mimeType;
    data.fileUrl = downloadURL;
    const newCard = await Card.create(data);
    return newCard;
  },

  updateCard: async function (id, data) {
    const card = await Card.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      data
    );
    return card;
  },

  deleteCardById: async function (id) {
    const card = await Card.findByIdAndDelete(id);
    return card;
  },

  getCardsBySet: async function (id) {
    const cards = await Card.find({ setId: id });
    return cards;
  },
};
