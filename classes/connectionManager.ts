import { isObjectEmpty } from '../utils';
import { VersionResponse, ClientRequestError } from './types';

export default class ConnectionManager {
  readonly apiUrl: string;

  readonly adminEndpoint: string;

  readonly versionEndpoint: string;

  private readonly username: string;

  private readonly password: string;

  version = '';

  init: Promise<void>;

  static readonly TIMEOUT = 1000 * 10; // 10 seconds;

  static POLL_TIMEOUT = 3000;

  constructor(
    apiUrl: string,
    adminEndpoint: string,
    versionEndpoint: string,
    version: string,
    username: string,
    password: string
  ) {
    this.apiUrl = apiUrl;
    this.adminEndpoint = adminEndpoint;
    this.versionEndpoint = versionEndpoint;
    this.version = version;
    this.username = username;
    this.password = password;
    this.init = this.connect();
  }

  async login() {
    await this.send('/login', {
      username: this.username,
      password: this.password,
    });
  }

  private static getTimeout(init = true, timeout = ConnectionManager.TIMEOUT) {
    const abroter = new AbortController();
    if (init) {
      setTimeout(() => {
        abroter.abort();
      }, timeout);
    }
    return abroter;
  }

  async send<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    await this.init;
    return fetch(this.makeUrl(endpoint), {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: 'https://localhost:3210',
      },
      signal: ConnectionManager.getTimeout().signal,
      body: JSON.stringify(body),
    }).then(ConnectionManager.handleResponse);
  }

  private static async handleResponse(response: Response) {
    const json = await response.json().catch(() => {
      throw new Error(
        'Server returned invalid response, are you sure you properly configured the api url?'
      );
    });
    if (!response.ok) {
      if (json.error) {
        throw new Error(json.error);
      }
      throw new Error(`An error occured ${json?.message}`);
    }
    return json;
  }

  async get<T>(endpoint: string): Promise<T> {
    await this.init;
    return fetch(this.makeUrl(endpoint), {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        Origin: 'https://localhost:3210',
      },
      signal: ConnectionManager.getTimeout().signal,
    }).then(ConnectionManager.handleResponse);
  }

  private makeUrl(endpoint: string) {
    return `${this.apiUrl}${this.adminEndpoint}${endpoint}`;
  }

  private async checkVersion() {
    const serverVersion = await ConnectionManager.getServerVersion(
      `${this.apiUrl}${this.versionEndpoint}`
    );
    if (this.version !== serverVersion) {
      throw new Error(
        `Version with server does not match: client-${this.version}|server-${serverVersion}. You have to update`
      );
    }
  }

  static async getServerVersion(versionUrl: string) {
    try {
      const { version }: VersionResponse = await fetch(versionUrl, {
        method: 'GET',
        headers: { Origin: 'https://localhost:3210' },
        signal: ConnectionManager.getTimeout().signal,
      }).then(ConnectionManager.handleResponse);

      return version;
    } catch (err) {
      throw new Error(
        'Unable to reach the server, are you sure you properly configured the api url?'
      );
    }
  }

  public async connect() {
    await this.checkVersion();
  }

  public poll<T extends object>(
    url: string,
    onPoll: (data: T) => boolean,
    pollInterval: number = ConnectionManager.POLL_TIMEOUT
  ) {
    return new Promise<void>((resolve, reject) => {
      const updt = async () => {
        try {
          const data = await this.get<T | ClientRequestError>(url);
          let keepPolling = true;
          if (!isObjectEmpty(data)) {
            if ('error' in data) throw new Error(data.error);
            const noErrorData = data as T;
            keepPolling = onPoll(noErrorData);
          }
          if (keepPolling) {
            setTimeout(updt, pollInterval);
          } else {
            resolve();
          }
        } catch (err) {
          reject(err);
        }
      };
      updt();
    });
  }
}
