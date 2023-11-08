const Bull = require("bull");
const axios = require("axios");

// Retrieve environment variables
const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

class ReviewTestBullQueue {
  constructor() {
    // Initialize the Bull queue with Redis settings
    this.queue = new Bull("review-queue", {
      redis: {
        host,
        port: Number(port),
        password,
      },
    });

    // Add a worker to process jobs in the queue
    this.queue.process(async (job) => {
      try {
        // Extract the 'id' from the job data
        const id = job.data.id;

        // Create data for the webhook request
        const data = {
          reviewTestId: id,
        };

        // Send a POST request to a webhook URL
        axios
          .post("http://localhost:3000/api/v1/webhook/review-test", data)
          .then((res) => {
            console.log(`statusCode: ${res.status}`);
            console.log(JSON.stringify(res.data.data.reviewTest));
          })
          .catch((error) => {
            console.error(error);
          });
      } catch (error) {
        console.log("Process error: ", error);
        return { error: "Process error: " };
      }
    });
  }

  // Add a review job to the queue
  async addReviewQueue(data) {
    try {
      // Calculate the delay based on the specified time
      const time = new Date(data.time).getTime();
      // If time < current time, set no delay
      const delay = time - Date.now() > 0 ? time - Date.now() : 1;

      const jobId = data.id;

      // Add a job to the queue with specified options
      await this.queue.add(data, {
        delay: 1000,
        jobId,
      });
      return jobId;
    } catch (error) {
      console.log("Add review job to the queue error: ", error);
      return { error: "Add review job to the queue error: " };
    }
  }

  // Get a job from the queue by its ID
  async getJobById(id) {
    try {
      const job = await this.queue.getJob(id);
      return job;
    } catch (error) {
      console.log("Get job by ID error: ", error);
      return { error: "Get job by ID error: " };
    }
  }

  // Delete a job from the queue by its ID
  async deleteJobById(id) {
    const job = await this.getJobById(id);
    await job.remove();

    return job;
  }
}

module.exports = ReviewTestBullQueue;
