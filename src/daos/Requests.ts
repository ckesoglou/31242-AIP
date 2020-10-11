import { DataTypes, Op, Sequelize } from "sequelize";
import Request from "../entities/Request";
import db from "./DBInstance";

Request.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    completed_by: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    proof_of_completion: {
      type: DataTypes.UUIDV4,
      allowNull: true,
    },
    details: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    created_time: {
      type: DataTypes.DATE(),
      allowNull: false,
    },
    completion_time: {
      type: DataTypes.DATE(),
      allowNull: true,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "requests",
    timestamps: false,
  }
);

export async function getRequest(id: string) {
  return Request.findByPk(id);
}

export interface IRequestsFilter {
  author?: string;
  search?: string;
  rewards?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  completedAfter?: Date;
  completedBefore?: Date;
  completed?: boolean;
  completedBy?: string;
}

export async function getRequests(
  start: number,
  limit: number,
  filter: IRequestsFilter
) {
  return Request.findAll({
    where: {
      author: filter.author ?? undefined,
      details:
        filter.search != null
          ? {
              [Op.like]: "%as",
            }
          : undefined,
    },
    order: Sequelize.col("created_time"),
    offset: 0,
    limit: 25,
    include: [{
      model: IOU,
      where: {
        id: 
      }
    }]
  });
}

export async function createRequest(
  id: string,
  author: string,
  completed_by: string,
  proof_of_completion: string,
  details: string,
  created_time: Date,
  completion_time: Date,
  is_completed: boolean
) {
  return Request.create({
    id: id,
    author: author,
    completed_by: completed_by,
    proof_of_completion: proof_of_completion,
    details: details,
    created_time: created_time,
    completion_time: completion_time,
    is_completed: is_completed,
  });
}

export async function deleteRequest(request: Request) {
  return request.destroy();
}
