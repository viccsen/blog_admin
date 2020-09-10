const empty = () => {
};

export default class CountDown {
  invoke: (count: number) => void;
  complete: () => void;
  count: number = 1;

  private reset: number;
  private sid: NodeJS.Timeout;
  private run: () => void;

  constructor(invoke?: (count: number) => void, complete?: () => void) {
    this.invoke = invoke || empty;
    this.complete = complete || empty;
    this.count = 1;
  }

  start(count?: number) {
    if (count) {
      this.reset = count;
    }
    this.count = count || this.count;
    this.run = () => {
      this.invoke(this.count--);
      if (this.count >= 0) {
        this.sid = setTimeout(this.run, 1000);
      } else {
        this.complete();
      }
      return this;
    };
    return this.run();
  }

  stop() {
    clearTimeout(this.sid);
    this.count = 0;
    this.complete();
  }

  pause() {
    clearTimeout(this.sid);
  }

  continue() {
    this.run();
  }

  restart() {
    this.start(this.reset);
  }
}
