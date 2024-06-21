import {prisma} from "@/server";
import {ERROR} from "@/config";
import {createHandler, idParam, isAuthorByHabitID, isAuthorByRecordID, sessionUserID} from "@/utils";

const getAll = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const result = await prisma.record.findMany({where: {Habit: {User: {id: userId}}}});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

const getOne = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const recordId = idParam(req, res, next);
    if (!await isAuthorByRecordID(recordId, userId)) {
      next(ERROR["RECORD/WRONG_USER"]);
    }
    else {
      const result = await prisma.record.findUnique({where: {id: recordId, Habit: {User: {id: userId}}}, include: {Habit: true}});
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

const getAllByHabitID = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const habitId = idParam(req, res, next);
    if (!await isAuthorByHabitID(habitId, userId)) {
      next(ERROR["RECORD/WRONG_USER"]);
    } else {
      const result = await prisma.record.findMany({
        where: {Habit: {id: habitId, User: {id: userId}}}, select: {
          id: true,
          date: true,
        }
      });
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
})

const postByHabitID = createHandler(async (req, res, next) => {
  try {
    const habitId = idParam(req, res, next);
    const result = await prisma.record.create({data: {Habit: {connect: {id: habitId}}}, include: {Habit: true}});
    res.json(result);
  } catch (error) {
    next(error);
  }
})

const deleteOne = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const recordId = idParam(req, res, next);
    if (!await isAuthorByRecordID(recordId, userId)) {
      next(ERROR["RECORD/WRONG_USER"]);
    }
    else {
      const result = await prisma.record.delete({where: {id: recordId, Habit: {User: {id: userId}}}});
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

export const record = {
  GET_ALL: getAll,
  GET_BY_ID: getOne,
  GET_BY_HABIT_ID: getAllByHabitID,
  PUT_BY_HABIT_ID: postByHabitID,
  DELETE_BY_ID: deleteOne,
}