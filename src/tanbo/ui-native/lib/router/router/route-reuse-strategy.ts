import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { RouteCacheController } from './route-cache-controller';

@Injectable()
export class UIRouteReuseStrategy implements RouteReuseStrategy {
  private caches: { [key: string]: Array<DetachedRouteHandle> } = {};

  private isCache: boolean = false;
  private routeSequence: Array<string> = [];

  private static getRouteIdentifier(route: ActivatedRouteSnapshot): string {
    const urls = [];

    if (route.routeConfig.loadChildren) {
      return UIRouteReuseStrategy.getRouteIdentifier(route.firstChild);
    }

    let r = route;

    while (r && r.routeConfig) {
      urls.unshift(r.routeConfig.path);
      r = r.parent;
    }
    return urls.join('/');
  }

  constructor(private routeCacheController: RouteCacheController) {
    this.routeCacheController.hasCache.subscribe(b => {
      this.isCache = b;
    });
  }

  // 是否缓存路由
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.isCache;
  }

  // 存储路由
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
    const url = UIRouteReuseStrategy.getRouteIdentifier(route);
    if (handle) {
      this.routeSequence.push(url);
      if (!this.caches[url]) {
        this.caches[url] = [];
      }
      this.caches[url].push(handle);
      return;
    }
    const caches = this.caches[url];
    caches.pop();
    if (caches.length === 0) {
      delete this.caches[url];
    }
  }

  // 是否还原当前路由
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = UIRouteReuseStrategy.getRouteIdentifier(route);

    const lastUrl = this.routeSequence[this.routeSequence.length - 1];
    if (url && this.caches[url] && url === lastUrl) {
      this.routeSequence.pop();
      return true;
    }
    return false;
  }

  // 取得之前缓存的路由
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {

    if (!route.routeConfig || this.isCache) {
      return null;
    }
    const url = UIRouteReuseStrategy.getRouteIdentifier(route);
    const caches = this.caches[url] || [];
    return caches[caches.length - 1];
  }

  // 是否重用路由
  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === current.routeConfig;
  }
}
