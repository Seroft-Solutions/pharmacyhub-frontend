class ServiceLocator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private services: Map<string, any> = new Map();

  public register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  public get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service "${name}" not found.`);
    }
    return service as T;
  }
}

const serviceLocator = new ServiceLocator();

export default serviceLocator;