import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { RouteCacheController } from './route-cache-controller';

@Injectable()
export class UIRouteReuseStrategy implements RouteReuseStrategy {
    private caches: { [key: string]: DetachedRouteHandle } = {};

    private isCache: boolean = false;

    constructor(private routeCacheController: RouteCacheController) {
        this.routeCacheController.hasCache$.subscribe(b => {
            this.isCache = b;
        });
    }

    shouldDetach(route: ActivatedRouteSnapshot) {

        return this.isCache;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
        this.caches[route.routeConfig.path] = handle;
    }

    shouldAttach(route: ActivatedRouteSnapshot) {
        return !!route.routeConfig && !!this.caches[route.routeConfig.path];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) {
            return null;
        }
        return this.caches[route.routeConfig.path];
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot) {
        return future.routeConfig === current.routeConfig;
    }
}
