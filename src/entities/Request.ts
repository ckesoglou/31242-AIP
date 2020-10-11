import { Model } from "sequelize";

interface IRequestAttributes {
  id: string;
  author: string;
  completed_by: string;
  proof_of_completion: string;
  details: string;
  created_time: Date;
  completion_time: Date;
  is_completed: boolean;
}

class Request extends Model<IRequestAttributes> implements IRequestAttributes {
  public id!: string;
  public author!: string;
  public completed_by!: string;
  public proof_of_completion!: string;
  public details!: string;
  public created_time!: Date;
  public completion_time!: Date;
  public is_completed!: boolean;
}

export default Request;
