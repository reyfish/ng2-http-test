// App
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class TestService {
  constructor(private http: Http) {}

  getUsers() {
    return this.http.get('http://foo.bar');
  }
}


// App tests
import { inject, TestBed } from '@angular/core/testing';

import { BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe('Http', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TestService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: 'got response' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when subscribed to getUsers', inject([TestService], (testService: TestService) => {
    testService.getUsers().subscribe((res: Response) => {
      expect(res.text()).toBe('got response');
    });
  }));

})