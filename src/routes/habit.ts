import {prisma} from "@/app";
import {toInt} from "@/utils";
import {createHandler} from "@/utils/create";
import {Prisma} from "@prisma/client";

export const getGroupedHabits  = createHandler(async (req, res, next) => {
  // get all habits and group them by category, sorted by items in category count
  try {
    const habitCategories = await prisma.habit.groupBy({by: ['Category'], _count: {id: true}, orderBy: [{_count: {id: 'desc'}}]});
    res.json(habitCategories);
  } catch (error) {
    next(error);
  }
});

export const getHabitsHandler = createHandler(async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({where: {userId: req.session.user as any}});
    res.json(habits);
  } catch (error) {
    next(error);
  }
});

export const getHabitIdsHandler = createHandler(async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({where: {userId: req.session.user as any}});
    res.json(habits.map((habit) => habit.id));
  } catch (error) {
    next(error);
  }
});

export const getSpecificHabitHandler = createHandler(async (req, res, next) => {
  const id = toInt(req.params.id);
  try {
    const habit = await prisma.habit.findUnique({where: {id: id, userId: req.session.user as any}, include: {records: true}});
    res.json(habit);
  } catch (error) {
    next(error);
  }
});

export const createHabitHandler = createHandler(async (req, res, next) => {
  const habit : Prisma.HabitCreateInput = req.body;
  try {
    const result = await prisma.habit.create({data: {...habit, userId: req.session.user as any}});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export const deleteHabitHandler = createHandler(async (req, res, next) => {
  const id = toInt(req.params.id);
  try {
    const habit = await prisma.habit.delete({where: {id: id, userId: req.session.user as any}});
    res.json(habit);
  } catch (error) {
    next(error);
  }
})


export const deleteMyUser = createHandler( async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({where: {id: req.session.user as any}});
    res.json(user);
  } catch (error) {
    next(error);
  }
});