import { ApplicationCommandOptionType } from "discord.js";
import LinkNodeCommand from "./commands/LinkNodeCommand";
import Command from "./commands/Command"
import UnlinkNodeCommand from "./commands/UnlinkNodeCommand";
import AddTrackerCommand from "./commands/AddTrackerCommand";
import RemoveTrackerCommand from "./commands/RemoveTrackerCommand";
import AddBalloonCommand from "./commands/AddBalloonCommand";
import RemoveBalloonCoomand from "./commands/RemoveBalloonCommand";
import BanNodeCommand from "./commands/BanNodeCommand";
import UnbanNodeCommand from "./commands/UnbanNodeCommand";
import NodesCommand from "./commands/NodesCommand";
import CommandMessage from "./commands/message/CommandMessage";
import MqttCommand from "./commands/message/MqttCommand";

export type CommandType = {
  name: string;
  description: string;
  class: Command;
  options: OptionType[];
};

export type CommandMessageType = {
  name: string;
  description: string;
  class: CommandMessage;
};

export type OptionType = {
  name: string;
  type: ApplicationCommandOptionType;
  description: string;
  required: boolean;
}

export const messageCommands: CommandMessageType[] = [
  {
    name: "mqtt",
    description: "View MQTT details",
    class: new MqttCommand
  }
];

export const commands: CommandType[] = [
  // {
  //   name: "nodes",
  //   description: "Claim a node you own, and only ones you own, and link it to your discord",
  //   class: new NodesCommand,
  //   options: [
  //     {
  //       name: "user",
  //       type: ApplicationCommandOptionType.User,
  //       description: "Nodes you own or that someone else owns",
  //       required: false,
  //     },
  //   ],
  // },
  {
    name: "linknode",
    description: "Claim a node you own, and only ones you own, and link it to your discord",
    class: new LinkNodeCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The hex or integer node ID to link",
        required: true,
      },
    ],
  },
  {
    name: "unlinknode",
    description: "Unlink a node from your discord",
    class: new UnlinkNodeCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The node hex ID to unlink",
        required: true,
      },
    ],
  },
  {
    name: "addtracker",
    description: "Start position updates from node in discord",
    class: new AddTrackerCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The hex or integer node ID to start tracking",
        required: true,
      },
    ],
  },
  {
    name: "removetracker",
    description: "Stop position updates from node in discord",
    class: new RemoveTrackerCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The hex or integer node ID to stop tracking",
        required: true,
      },
    ],
  },
  {
    name: "addballoon",
    description: "Start position updates from node in discord",
    class: new AddBalloonCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The hex or integer node ID to start tracking",
        required: true,
      },
    ],
  },
  {
    name: "removeballoon",
    description: "Stop position updates from node in discord",
    class: new RemoveBalloonCoomand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The hex or integer node ID to stop tracking",
        required: true,
      },
    ],
  },
  {
    name: "bannode",
    description: "Ban a node from logger",
    class: new BanNodeCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The node ID to ban",
        required: true,
      },
    ],
  },
  {
    name: "unbannode",
    description: "Unban a node from logger",
    class: new UnbanNodeCommand,
    options: [
      {
        name: "nodeid",
        type: ApplicationCommandOptionType.String,
        description: "The node ID to unban",
        required: true,
      },
    ],
  },
];