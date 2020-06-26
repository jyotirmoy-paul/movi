const mongoose = require("mongoose");

class CacheService {
  constructor() {
    if (CacheService.instance instanceof CacheService) {
      return CacheService.instance;
    }

    mongoose.set("useFindAndModify", false);
    mongoose.connect(process.env.mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.Url = mongoose.model("Url", {
      _id: String,
      expiry: Number,
      cachedResponse: String,
    });

    Object.freeze(this);
    CacheService.instance = this;
  }

  getResponse(url) {
    return new Promise((resolve, reject) => {
      this.Url.findById(url, (err, response) => {
        if (response === null) {
          reject(err);
          return;
        }

        if (response.expiry > new Date().getTime()) {
          resolve(response.cachedResponse);
        }
      });
    });
  }

  saveResponse(url, response, expiryTime) {
    return new Promise((resolve, reject) => {
      const cachedData = new this.Url({
        _id: url,
        expiry: new Date().getTime() + expiryTime * 1000,
        cachedResponse: response,
      });

      this.Url.findOneAndUpdate(
        { _id: url },
        cachedData,
        { upsert: true },
        (err, _) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }
}

module.exports = CacheService;
