import { DataTypes } from "sequelize";
import Iou, { IIouAttributes } from "../entities/Iou";
import db from "./DBInstance";
import { v4 as uuid } from "uuid";
import { getBasicUser, getUser } from "./Users";
import { getItem } from "./Items";
import User from "@entities/User";
import { values } from "sequelize/types/lib/operators";
import e from "express";

interface vertexTrack {
  [index: string]: boolean | string;
}

class UserNode {
  name: string;
  peopleOwing: UserNode[];
  constructor(name: string) {
    this.name = name;
    this.peopleOwing = [];
  }

  addOwingUser(user: UserNode) {
    this.peopleOwing.push(user);
  }

  getOwingUsers() {
    return this.peopleOwing;
  }
}

class IouGraph {
  users: UserNode[];
  usersInParty: string[];

  constructor() {
    this.users = [];
    this.usersInParty = [];
  }

  dfs(newIou: Iou) {
    const userNode = this.users.find(
      (user) => user.name == newIou.giver.toString()
    );
    var visited: vertexTrack = {};
    var recStack: any = {};

    if (userNode) {
      var result = this.detectCycleWithinGraph(userNode, visited, recStack);
      if (result !== false) return result;
    }

    return false;
  }

  detectCycleWithinGraph(
    userNode: UserNode,
    visited: vertexTrack,
    recStack: vertexTrack
  ) {
    if (!visited[userNode.name]) {
      visited[userNode.name] = true;
      recStack[userNode.name] = true;
      this.usersInParty.push(userNode.name);
      const nodeNeighbors = userNode.getOwingUsers();
      for (let currentNode of nodeNeighbors) {
        if (
          !visited[currentNode.name] &&
          this.detectCycleWithinGraph(currentNode, visited, recStack)
        ) {
          return this.usersInParty;
        } else if (recStack[currentNode.name]) {
          return this.usersInParty;
        }
      }
    }
    recStack[userNode.name] = false;
    return false;
  }

  addUserNode(username: string) {
    this.users.push(new UserNode(username));
  }

  getUserNode(username: string) {
    return this.users.find((user) => user.name === username);
  }

  addEdge(giver: string, receiver: string) {
    const giverUser = this.getUserNode(giver);
    const receiverUser = this.getUserNode(receiver);
    if (giverUser && receiverUser) giverUser.addOwingUser(receiverUser);
  }

  print() {
    return this.users;
  }
}

Iou.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    item: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    giver: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    receiver: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    parent_request: {
      type: DataTypes.UUIDV4,
      allowNull: true,
    },
    proof_of_debt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proof_of_completion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    claimed_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_claimed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { sequelize: db, tableName: "ious", timestamps: false }
);
export interface IIouFilter {
  giver?: string;
  receiver?: string;
  parent_request?: string;
  is_claimed?: boolean;
  item?: string;
}

export async function getIou(pk: string) {
  return Iou.findByPk(pk);
}
export async function getIous(
  filter: IIouFilter,
  start: number = 0,
  limit: number = 25
) {
  return Iou.findAll({
    where: filter,
    offset: start,
    limit: 9999, // TODO limit,
  });
}

export async function getFormattedIous(
  filter?: IIouFilter,
  start: number = 0,
  limit: number = 25
) {
  const ious = await Iou.findAll({
    offset: start,
    limit: 9999, // TODO limit,
    subQuery: false,
    where: filter,
  });
  // detail user
  for (let iou of ious) {
    iou.item = (await getItem(iou.item as string)) as Object;
    iou.giver = (await getBasicUser(iou.giver as string)) ?? {};
    iou.receiver = (await getBasicUser(iou.receiver as string)) ?? undefined;
  }
  return ious;
}

export async function createIouOwed(
  giver: string,
  receiver: string,
  item: string,
  proof: string
) {
  const ious = await Iou.create({
    id: uuid(),
    item: item,
    giver: giver,
    receiver: receiver,
    parent_request: undefined,
    proof_of_debt: proof,
    proof_of_completion: undefined,
    created_time: new Date(),
    claimed_time: undefined,
    is_claimed: false,
  });
  return ious.id;
}

export async function iouExists(iouID: string) {
  return (await Iou.findByPk(iouID)) ? true : false;
}

export async function partyDetection(newIou: Iou) {
  const graph = new IouGraph();

  var ious = await Iou.findAll({
    where: { is_claimed: false },
  });

  if (ious === null) {
    return false;
  } else {
    for (let iou of ious) {
      if (iou) {
        var receiver;
        var giver;
        if (iou.receiver) {
          receiver = iou.receiver.toString();
          if (!graph.getUserNode(receiver)) {
            graph.addUserNode(receiver);
          }
        }

        giver = iou.giver.toString();
        if (!graph.getUserNode(giver)) {
          graph.addUserNode(giver);
        }
        if (receiver && giver) {
          graph.addEdge(giver, receiver);
        }
      }
    }
    var cycleCheckResults = graph.dfs(newIou);

    if (!cycleCheckResults) {
      console.log("No party detected");
    } else {
      return cycleCheckResults;
    }
  }
}

export async function completeIouOwed(iouID: string, receiver: string) {
  // user that completes must be receiver
  const iou = await Iou.findOne({ where: { id: iouID, receiver: receiver } });
  if (iou === null) {
    return false;
  } else {
    iou
      .update({
        claimed_time: new Date(),
        is_claimed: true,
      })
      .then(async () => await Iou.sync({ alter: true }));
  }
  return true;
}

export async function createIou(iou: IIouAttributes) {
  return Iou.create(iou);
}

export async function createIouOwe(
  giver: string,
  receiver: string,
  item: string
) {
  const ious = await Iou.create({
    id: uuid(),
    item: item,
    giver: giver,
    receiver: receiver,
    parent_request: undefined,
    proof_of_debt: undefined,
    proof_of_completion: undefined,
    created_time: new Date(),
    claimed_time: undefined,
    is_claimed: false,
  });

  return ious.id;
}

export async function completeIouOwe(
  iouID: string,
  giver: string,
  proof: string
) {
  // user that completes must be receiver
  const iou = await Iou.findOne({ where: { id: iouID, giver: giver } });
  if (iou === null) {
    return false;
  } else {
    iou
      .update({
        claimed_time: new Date(),
        is_claimed: true,
        proof_of_completion: proof,
      })
      .then(async () => await Iou.sync({ alter: true }));
  }
  return true;
}

export async function updateIou(iou: Iou, attributes: IIouAttributes) {
  return iou.update(attributes);
}

export async function deleteIou(iou: Iou) {
  return iou.destroy();
}
