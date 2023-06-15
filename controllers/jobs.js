import Job from '../models/job.js';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../errors/index.js';

export const getAllJobs = async (req, res) => {
  const { userId } = req.user;
  const data = await Job.find({ createdBy: userId });
  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'Success',
    dataCount: data.length,
    data,
  });
};

export const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const data = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!data) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'Success',
    data,
  });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({
    statusCode: StatusCodes.CREATED,
    message: 'Job created',
    job,
  });
};

export const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (!company.trim() || !position.trim()) {
    throw new BadRequestError('Company and Position fields cannot be empty');
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'Success',
    job,
  });
};

export const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndDelete(
    { _id: jobId, createdBy: userId }
  );
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({
    statusCode: StatusCodes.OK,
    message: 'Success',
  });
};
