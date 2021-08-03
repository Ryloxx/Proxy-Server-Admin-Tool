import { VersionResponse } from './types';

export default class ConnectionManager {
  readonly apiUrl: string;

  readonly adminEndpoint: string;

  readonly versionEndpoint: string;

  private readonly username: string;

  private readonly password: string;

  version = '';

  readonly init: Promise<void>;

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
    const { version }: VersionResponse = await fetch(versionUrl, {
      method: 'GET',
      headers: { Origin: 'https://localhost:3210' },
    }).then(ConnectionManager.handleResponse);

    return version;
  }

  public async connect() {
    await this.checkVersion();
  }
}
