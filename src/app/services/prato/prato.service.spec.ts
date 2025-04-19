import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PratoService } from './prato.service';
import { Prato } from './prato.model';

describe('PratoService', () => {
  let service: PratoService;
  let httpMock: HttpTestingController;

  const dummyPratos: Prato[] = [
    { id: 1, nome: 'Lasanha', descricao: 'Lasanha de carne', valor: 25.5 },
    { id: 2, nome: 'Pizza', descricao: 'Pizza de calabresa', valor: 30.0 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PratoService]
    });

    service = TestBed.inject(PratoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Garante que não há requisições pendentes
  });

  it('deve retornar uma lista de pratos (GET)', () => {
    service.getPratos().subscribe((pratos) => {
      expect(pratos.length).toBe(2);
      expect(pratos).toEqual(dummyPratos);
    });

    const req = httpMock.expectOne('http://localhost:8000/get_pratos');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPratos);
  });

  it('deve adicionar um prato (POST)', () => {
    const newPrato: Prato = {
      id: 3,
      nome: 'Hambúrguer',
      descricao: 'Hambúrguer artesanal',
      valor: 20
    };

    service.addPrato(newPrato).subscribe((response) => {
      expect(response).toBeUndefined(); // pois é Observable<void>
    });

    const req = httpMock.expectOne('http://localhost:8000/add_prato');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPrato);
    req.flush(null); // Resposta vazia simulada
  });
});
