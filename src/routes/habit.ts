import {prisma} from "@/server";
import {idParam, sessionUserID} from "@/utils";
import {createHandler} from "@/utils";
import {Prisma} from "@prisma/client";

const getList = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const habits = await prisma.habit.findMany({where: {userId}, include: {records: true, _count: {select: {records: true}}}});
    res.json(habits);
  } catch (error) {
    next(error);
  }
});

const getByID = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next)
    const id = idParam(req, res, next);
    const habit = await prisma.habit.findUnique({where: {id, userId}, include: {records: true, _count: {select: {records: true}}}});
    res.json(habit);
  } catch (error) {
    next(error);
  }
});

const create = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    let habit : Prisma.HabitCreateInput = req.body;
    const result = await prisma.habit.create({data: {
      ...habit,
      User: {connect: {id: userId}}
    }});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

const deleteByID = createHandler(async (req, res, next) => {
  try {
    const id = idParam(req, res, next);
    const userId = sessionUserID(req, res, next);
    const result = await prisma.habit.delete({where: {id, userId}});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Update a habit
// Params: habitId
// Body: HabitUpdateInput
const updateHabit = createHandler(async (req, res, next) => {
  try {
    const id = idParam(req, res, next);
    const userId = sessionUserID(req, res, next);
    let data : Prisma.HabitUpdateInput = req.body;
    if (data.User) delete data.User;
    const result = await prisma.habit.update({where: {id, userId}, data})
    res.json(result);
  } catch (error) {
    next(error);
  }
});

const getIds = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const habits = await prisma.habit.findMany({where: {userId}, select: {id: true}});
    res.json(habits);
  } catch (error) {
    next(error);
  }
});

const listCategory = createHandler(async (req, res, next) => {
  try {
    const userId = sessionUserID(req, res, next);
    const categories = await prisma.habit.groupBy({
      by: ['Category'], // 'Category' is a field in the Habit model
      where: {User: {id: userId}},
      having: {Category: {not: null}},
      _count: {
        id: true
      }
    })
    res.json(categories);
  } catch (error) {
    next(error);
  }
})

export const habit = {
  GET: getList,
  PUT: create,
  GET_IDS: getIds,
  GET_CATEGORY: listCategory,
  DELETE_BY_ID: deleteByID,
  PATCH_BY_ID: updateHabit,
  GET_BY_ID: getByID
};