const trainingsService = require('./trainingsService');

const service = new trainingsService();

class trainingsController {
  create = async (req, res) => {
    const result = await service.createTraining(req.body, req.user);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  find = async (req, res) => {
    const result = await service.getTraining(req.user._id);

    res.status(200).json({ status: 200, message: 'ok', result });
  };

  addReadPages = async (req, res) => {
    const result = await service.addReadPagesToStat(req.body, req.user);

    res.status(200).json({ status: 200, message: 'ok', result });
  };
}

module.exports = trainingsController;
