import { TestBed } from '@angular/core/testing';

import { ClassificacaoService } from '../classificacao/classificacao.service';

describe('ClassificacaoService', () => {
  let service: ClassificacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassificacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
