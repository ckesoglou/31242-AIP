import StockPopperJs from "popper.js";

// This is needed because of a Jest bug - see https://github.com/mui-org/material-ui/issues/15726
export default class PopperJs {
  static placements = StockPopperJs.placements;

  constructor() {
    return {
      destroy: () => {},
      scheduleUpdate: () => {},
      update: () => {},
    };
  }
}
