import {
    Directive,
    Input,
    Attribute,
    Renderer2,
    ElementRef,
    HostListener,
    HostBinding,
    OnChanges,
    OnDestroy
} from '@angular/core';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Router, UrlTree, NavigationEnd } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { Subscription } from 'rxjs';

import { UIRouter } from './router';

@Directive({
    selector: ':not(a)[uiRouterLink]'
})
export class UIRouterLinkDirective {
    @Input()
    queryParams: { [k: string]: any };
    @Input()
    fragment: string;
    @Input()
    queryParamsHandling: QueryParamsHandling;
    @Input()
    preserveFragment: boolean;
    @Input()
    skipLocationChange: boolean;
    @Input()
    replaceUrl: boolean;
    @Input()
    preserveQueryParams: boolean;

    @Input()
    set uiRouterLink(commands: any[] | string) {
        if (commands !== null && commands !== undefined) {
            this.commands = Array.isArray(commands) ? commands : [commands];
        } else {
            this.commands = [];
        }
    }

    private commands: Array<any> = [];

    constructor(private uiRouter: UIRouter,
                /* tslint:disable */
                @Attribute('tabindex') tabIndex: string,
                /* tslint:enable */
                renderer: Renderer2,
                el: ElementRef) {
        if (tabIndex === null || tabIndex === undefined) {
            renderer.setAttribute(el.nativeElement, 'tabindex', '0');
        }
    }

    @HostListener('click')
    click(): boolean {
        this.uiRouter.navigate(this.commands, {
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserveQueryParams),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
            byActivatedRoute: true
        });
        return true;
    }
}

@Directive({
    /* tslint:disable */
    selector: 'a[uiRouterLink]'
    /* tslint:enable */
})
export class UIRouterLinkWithHrefDirective implements OnChanges, OnDestroy {
    @HostBinding('attr.target')
    @Input()
    target: string;
    @Input()
    queryParams: { [k: string]: any };
    @Input()
    fragment: string;
    @Input()
    queryParamsHandling: QueryParamsHandling;
    @Input()
    preserveFragment: boolean;
    @Input()
    skipLocationChange: boolean;
    @Input()
    replaceUrl: boolean;
    @Input()
    preserveQueryParams: boolean;

    @Input()
    set uiRouterLink(commands: any[] | string) {
        if (commands !== null && commands !== undefined) {
            this.commands = Array.isArray(commands) ? commands : [commands];
        } else {
            this.commands = [];
        }
    }

    @HostBinding() href: string;

    private commands: any[] = [];
    private subscription: Subscription;

    constructor(private router: Router,
                private uiRouter: UIRouter,
                private locationStrategy: LocationStrategy) {
        this.subscription = router.events.subscribe(s => {
            if (s instanceof NavigationEnd) {
                this.updateTargetUrlAndHref();
            }
        });
    }

    ngOnChanges(changes: {}): any {
        this.updateTargetUrlAndHref();
    }

    ngOnDestroy(): any {
        this.subscription.unsubscribe();
    }

    @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
    onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
        if (button !== 0 || ctrlKey || metaKey || shiftKey) {
            return true;
        }

        if (typeof this.target === 'string' && this.target !== '_self') {
            return true;
        }

        this.uiRouter.navigate(this.commands, {
            byActivatedRoute: true,
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserveQueryParams),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
            skipLocationChange: attrBoolValue(this.skipLocationChange),
            replaceUrl: attrBoolValue(this.replaceUrl)
        });
        return false;
    }

    private updateTargetUrlAndHref(): void {
        this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
    }

    get urlTree(): UrlTree {
        return this.router.createUrlTree(this.commands, {
            relativeTo: this.uiRouter.getActivatedRoute(),
            queryParams: this.queryParams,
            fragment: this.fragment,
            preserveQueryParams: attrBoolValue(this.preserveQueryParams),
            queryParamsHandling: this.queryParamsHandling,
            preserveFragment: attrBoolValue(this.preserveFragment),
        });
    }
}

function attrBoolValue(s: any): boolean {
    return s === '' || !!s;
}