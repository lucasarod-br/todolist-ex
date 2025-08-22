const { db } = require('../utils/db');


function createTask(data) {
  return db.task.create({
    data,
  });
}

function getTasks(userId) {
  return db.task.findMany({
    where: { userId },
  });
}

function getTaskById(id) {
    id = Number(id);
  return db.task.findUnique({
    where: { id },
  });
}

function updateTask(id, data) {
    id = Number(id);
  return db.task.update({
    where: { id },
    data,
  });
}

function deleteTask(id) {
    id = Number(id);
  return db.task.delete({
    where: { id },
  });
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
