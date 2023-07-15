import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client: Stan | undefined;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }

  public connect(
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this._client!.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this._client!.on("error", (err) => {
        console.log("NATS Connection error");
        reject();
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
