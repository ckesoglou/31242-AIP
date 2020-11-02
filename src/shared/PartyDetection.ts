import Iou from "../models/Iou";

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
    const visited: vertexTrack = {};
    const recStack: any = {};

    if (userNode) {
      const cycleDetected = this.detectCycleWithinGraph(
        userNode,
        visited,
        recStack
      );
      if (cycleDetected) return this.usersInParty;
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
      for (const currentNode of nodeNeighbors) {
        if (
          !visited[currentNode.name] &&
          this.detectCycleWithinGraph(currentNode, visited, recStack)
        ) {
          return true;
        } else if (recStack[currentNode.name]) {
          return true;
        }
      }
    }
    recStack[userNode.name] = false;
    this.usersInParty.pop();
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

export async function partyDetection(newIou: Iou) {
  const graph = new IouGraph();

  const ious = await Iou.findAll({
    where: { is_claimed: false },
  });

  if (ious === null) {
    return false;
  } else {
    for (const iou of ious) {
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
    const cycleCheckResults = graph.dfs(newIou);

    if (!cycleCheckResults) {
      console.log("No party detected");
    } else {
      return cycleCheckResults;
    }
  }
}
