import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Headers, Http, RequestOptionsArgs, Response, ResponseContentType } from '@angular/http';

export interface UIRequestOptions {
    params?: {
        [key: string]: any | any[];
    };
    headers?: Headers;
    body?: any;
    withCredentials?: boolean;
    responseType?: ResponseContentType;
    apiPrefix?: string;
}

export interface UIHttpConfig {
    apiPrefix?: string;
    headers?: Headers;
    withCredentials?: boolean;
    responseType?: ResponseContentType;
    openTimestamp?: boolean;

    responseHandle?(response: Observable<Response>): Promise<any>;
}

@Injectable()
export class UIHttp {
    private static apiPrefix: string = '';
    private static headers: Headers = new Headers({
        'Content-type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8'
    });
    private static withCredentials: boolean = true;
    private static responseType: ResponseContentType = ResponseContentType.Json;
    private static openTimestamp: boolean = true;

    static config(config: UIHttpConfig) {
        UIHttp.apiPrefix = config.apiPrefix || UIHttp.apiPrefix;
        UIHttp.headers = config.headers || UIHttp.headers;
        UIHttp.withCredentials = config.withCredentials === true || config.withCredentials === undefined;
        UIHttp.responseType = config.responseType || UIHttp.responseType;
        UIHttp.openTimestamp = config.openTimestamp !== undefined ? config.openTimestamp : true;
        UIHttp.responseHandle = config.responseHandle || UIHttp.responseHandle;
        return UIHttp;
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

    private static requestHandle(options: UIRequestOptions, isUpload: boolean = false): RequestOptionsArgs {
        if (UIHttp.openTimestamp) {
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
        }) : UIHttp.headers;

        return {
            params: options.params,
            headers,
            body: options.body,
            withCredentials: options.withCredentials || UIHttp.withCredentials,
            responseType: options.responseType || UIHttp.responseType
        };
    }

    private static urlHandle(url: string, options: UIRequestOptions): string {
        if ((options as any).hasOwnProperty('apiPrefix')) {
            return options.apiPrefix + url;
        }
        return UIHttp.apiPrefix + url;
    }

    constructor(private http: Http) {
    }

    get(url: string, options: UIRequestOptions = {}): Promise<any> {
        const result: Observable<Response> = this.http.get(UIHttp.urlHandle(url, options),
            UIHttp.requestHandle(options));
        return UIHttp.responseHandle(result);
    }

    post(url: string, options: UIRequestOptions = {}): Promise<any> {
        const result: Observable<Response> = this.http.post(UIHttp.urlHandle(url, options),
            options.body,
            UIHttp.requestHandle(options));
        return UIHttp.responseHandle(result);
    }

    put(url: string, options: UIRequestOptions = {}): Promise<any> {
        const result: Observable<Response> = this.http.put(UIHttp.urlHandle(url, options),
            options.body,
            UIHttp.requestHandle(options));
        return UIHttp.responseHandle(result);
    }

    delete(url: string, options: UIRequestOptions = {}): Promise<any> {
        const result: Observable<Response> = this.http.delete(UIHttp.urlHandle(url, options),
            UIHttp.requestHandle(options));
        return UIHttp.responseHandle(result);
    }

    upload(url: string, options: UIRequestOptions = {}): Promise<any> {
        const result: Observable<Response> = this.http.post(UIHttp.urlHandle(url, options),
            options.body,
            UIHttp.requestHandle(options, true));
        return UIHttp.responseHandle(result);
    }
}