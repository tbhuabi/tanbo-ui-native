import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';

export interface UiRequestOptions {
    params?: {
        [key: string]: any | any[];
    };
    headers?: Headers;
    body?: any;
    withCredentials?: boolean;
    responseType?: ResponseContentType;
}

export interface UiHttpConfig {
    apiPrefix?: string;
    headers?: Headers;
    withCredentials?: boolean;
    responseType?: ResponseContentType;
    openTimestamp?: boolean;

    responseHandle?(response: Observable<Response>): Promise<any>;
}

@Injectable()
export class UiHttp {
    private static apiPrefix: string = '';
    private static headers: Headers = new Headers({
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8'
    });
    private static withCredentials: boolean = true;
    private static responseType: ResponseContentType = ResponseContentType.Json;
    private static openTimestamp: boolean = true;

    static config(config: UiHttpConfig) {
        UiHttp.apiPrefix = config.apiPrefix || UiHttp.apiPrefix;
        UiHttp.headers = config.headers || UiHttp.headers;
        UiHttp.withCredentials = config.withCredentials === true || config.withCredentials === undefined;
        UiHttp.responseType = config.responseType || UiHttp.responseType;
        UiHttp.openTimestamp = config.openTimestamp !== undefined ? config.openTimestamp : true;
        UiHttp.responseHandle = config.responseHandle || UiHttp.responseHandle;
        return UiHttp;
    }

    static responseHandle(response: Observable<Response>): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            response.toPromise().then(response => {
                if (response.status === 200) {
                    try {
                        let result = response.json();
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }

                } else {
                    reject(response.text());
                }
            }, error => {
                reject(error);
            });
        });
    }

    private static requestHandle(options: UiRequestOptions, isUpload: boolean = false): RequestOptionsArgs {
        if (UiHttp.openTimestamp) {
            if (options.params) {
                options.params.t = Date.now();
            } else {
                options.params = {
                    t: Date.now()
                };
            }
        }

        const headers = options.headers || isUpload ? new Headers({
            'Accept': 'application/json; charset=UTF-8'
        }) : UiHttp.headers;

        return {
            params: options.params,
            headers,
            body: options.body,
            withCredentials: options.withCredentials || UiHttp.withCredentials,
            responseType: options.responseType || UiHttp.responseType
        };
    }

    constructor(private http: Http) {
    }

    get(url: string, options: UiRequestOptions = {}): Promise<any> {
        const _options = UiHttp.requestHandle(options);
        const _url = _options.withCredentials ? url : UiHttp.apiPrefix + url;
        const result: Observable<Response> = this.http.get(_url, _options);
        return UiHttp.responseHandle(result);
    }

    post(url: string, options: UiRequestOptions = {}): Promise<any> {
        const _options = UiHttp.requestHandle(options);
        const _url = _options.withCredentials ? url : UiHttp.apiPrefix + url;
        const result: Observable<Response> = this.http.post(_url, options.body, _options);
        return UiHttp.responseHandle(result);
    }

    put(url: string, options: UiRequestOptions = {}): Promise<any> {
        const _options = UiHttp.requestHandle(options);
        const _url = _options.withCredentials ? url : UiHttp.apiPrefix + url;
        const result: Observable<Response> = this.http.put(_url, options.body, _options);
        return UiHttp.responseHandle(result);
    }

    delete(url: string, options: UiRequestOptions = {}): Promise<any> {
        const _options = UiHttp.requestHandle(options);
        const _url = _options.withCredentials ? url : UiHttp.apiPrefix + url;
        const result: Observable<Response> = this.http.delete(_url, _options);
        return UiHttp.responseHandle(result);
    }

    upload(url: string, options: UiRequestOptions = {}): Promise<any> {
        const _options = UiHttp.requestHandle(options);
        const _url = _options.withCredentials ? url : UiHttp.apiPrefix + url;
        const result: Observable<Response> = this.http.post(_url, options.body, _options);
        return UiHttp.responseHandle(result);
    }
}