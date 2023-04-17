const { Types } = require("mongoose");
const Set = require("../models/setModel");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { QuizService } = require("./quiz.service");
const QuizModel = require("../models/quizModel");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();

exports.SetService = {
  getSetById: async function (id) {
    const set = await Set.findOne({ _id: new Types.ObjectId(id) });
    return set;
  },

  getSets: async function (userId) {
    try {
      const set = await Set.aggregate().match({
        createdBy: new Types.ObjectId(userId),
      });

      return set;
    } catch (error) {
      console.log(error);
    }
  },

  getAllApprovedSets: async function () {
    try {
      const sets = await Set.find({ approved: true });
      return sets;
    } catch (error) {
      console.log(error);
    }
  },

  getAllSets: async function () {
    try {
      const sets = await Set.find({});
      return sets;
    } catch (error) {
      console.log(error);
    }
  },

  createSet: async function (data) {
    const newSets = await Set.create(data);
    return newSets;
  },

  updateSet: async function (req, res) {
    const id = req.params.setId;
    const data = req.body;
    const now = new Date().getMinutes();
    const mimeType = req.file.mimetype.split("/")[0];

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

    data.image = downloadURL;

    const set = await Set.findByIdAndUpdate(id, data, {
      new: true,
      // (trả về document mới nhất)
      runValidators: true,
      // (có chạy trình validate)
      upsert: true,
    });

    return set;
  },

  approveSet: async function (id) {
    const set = await Set.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    return set;
  },

  deleteSet: async function (id) {
    const set = await Set.findByIdAndDelete(id);
    const quiz = await QuizModel.findOneAndDelete({ setId: set._id });
    return set;
  },
};
