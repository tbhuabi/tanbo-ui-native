import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { RouteCacheController } from './route-cache-controller';

@Injectable()
export class UIRouteReuseStrategy implements RouteReuseStrategy {
    private caches: { [key: string]: DetachedRouteHandle } = {};

    private isCache: boolean = false;

    private static getRouteIdentifier(route: ActivatedRouteSnapshot) {
        const urls = [];
        let r = route;
        while (r && r.routeConfig) {
            urls.unshift(r.routeConfig.path);
            r = r.parent;
        }
        return urls.join('/');
    }

    constructor(private routeCacheController: RouteCacheController) {
        this.routeCacheController.hasCache$.subscribe(b => {
            this.isCache = b;
        });
    }

    // 是否缓存路由
    shouldDetach(route: ActivatedRouteSnapshot) {
        return this.isCache;
    }

    // 存储路由
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle) {
        this.caches[UIRouteReuseStrategy.getRouteIdentifier(route)] = handle;
    }

    // 是否还原当前路由
    shouldAttach(route: ActivatedRouteSnapshot) {
        return !!UIRouteReuseStrategy.getRouteIdentifier(route) &&
            !!this.caches[UIRouteReuseStrategy.getRouteIdentifier(route)];
    }

    // 取得之前缓存的路由
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) {
            return null;
        }
        return this.caches[UIRouteReuseStrategy.getRouteIdentifier(route)];
    }

    // 是否重用路由
    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot) {
        return UIRouteReuseStrategy.getRouteIdentifier(future) === UIRouteReuseStrategy.getRouteIdentifier(current);
    }
}
