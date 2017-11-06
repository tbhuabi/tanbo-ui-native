import { Injectable } from '@angular/core';
import { Router, Params, ActivatedRoute, UrlTree, NavigationExtras } from '@angular/router';
import { QueryParamsHandling } from '@angular/router/src/config';

export interface UINavigationExtras {
    queryParams?: Params | null;
    fragment?: string;
    preserveQueryParams?: boolean;
    queryParamsHandling?: QueryParamsHandling | null;
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    byActivatedRoute?: boolean;
}

@Injectable()
export class UIRouter {
    constructor(private router: Router,
                private activatedRoute: ActivatedRoute) {
    }

    getActivatedRoute(): ActivatedRoute {
        return this.activatedRoute;
    }

    updateActivateRoute(route: ActivatedRoute) {
        this.activatedRoute = route;
    }

    navigateByUrl(url: string | UrlTree, extras?: UINavigationExtras): Promise<boolean> {
        return this.router.navigateByUrl(url, this.navExtrasHandler(extras));
    }

    navigate(commands: any[], extras?: UINavigationExtras): Promise<boolean> {
        return this.router.navigate(commands, this.navExtrasHandler(extras));
    }

    private navExtrasHandler(extras?: UINavigationExtras): NavigationExtras {
        if (!extras) {
            return;
        }
        return {
            queryParams: extras.queryParams,
            fragment: extras.fragment,
            preserveQueryParams: extras.preserveQueryParams,
            queryParamsHandling: extras.queryParamsHandling,
            preserveFragment: extras.preserveFragment,
            skipLocationChange: extras.skipLocationChange,
            replaceUrl: extras.replaceUrl,
            relativeTo: extras.byActivatedRoute ? this.activatedRoute : null
        };
    }
}