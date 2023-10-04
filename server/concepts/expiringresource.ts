import { BaseDoc } from "../framework/doc";

interface ExpiringObj<Resource> extends BaseDoc {
  active: Resource;
  expiry: Date;
}

class ExpiringResourceConcept<Resource> {
  private resources = new Set<Resource>();

  // allocates resource r for t seconds
  public allocate(r: Resource, t: number) {
    this.resources.add(r);
    setTimeout(() => this.resources.delete(r), t * 1000);
  }

  // deallocates resource r immediately
  public deallocate(r: Resource) {
    this.resources.delete(r);
  }

  public getActiveResources() {
    return new Set(this.resources);
  }
}
