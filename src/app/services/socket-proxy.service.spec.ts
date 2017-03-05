import { TestBed, inject } from '@angular/core/testing';
import { SocketProxyService } from './socket-proxy.service';

describe('SocketProxyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketProxyService]
    });
  });

  it('should ...', inject([SocketProxyService], (service: SocketProxyService) => {
    expect(service).toBeTruthy();
  }));
});
